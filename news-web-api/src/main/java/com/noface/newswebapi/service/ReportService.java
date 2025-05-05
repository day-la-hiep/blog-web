package com.noface.newswebapi.service;

import com.noface.newswebapi.cons.ReportStatus;
import com.noface.newswebapi.cons.ReportTargetType;
import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.report.*;
import com.noface.newswebapi.dto.mapper.ReportMapper;
import com.noface.newswebapi.entity.Report;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.ReportRepository;
import com.noface.newswebapi.repository.CommentRepository;
import com.noface.newswebapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private ReportMapper reportMapper;

    public ReportCreateResponse createReport(ReportCreateRequest request) {
        String targetType;
        try {
            targetType = ReportTargetType.valueOf(request.getTargetType().toUpperCase()).name();
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_REPORT_TARGET_TYPE);
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (targetType.equals(ReportTargetType.COMMENT.name())) {
            if (!commentRepository.existsById(request.getTargetId())) {
                throw new AppException(ErrorCode.COMMENT_NOT_EXISTED);
            }
        } else if (targetType.equals(ReportTargetType.ARTICLE.name())) {
            if (!articleRepository.existsById(request.getTargetId())) {
                throw new AppException(ErrorCode.ARTICLE_NOT_EXISTED);
            }
        }
        Report report = Report.builder()
                .detail(request.getDetail())
                .reportStatus(ReportStatus.PENDING.name())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .reason(request.getReason())
                .author(user)
                .targetType(targetType)
                .targetId(request.getTargetId())
                .build();
        report = reportRepository.save(report);
        return reportMapper.toReportCreateResponse(report);
    }

    public PagedResult<ReportResponse> getReportsByTargetId(String targetId, String search, Pageable pageable) {
        Page<ReportResponse> reportResponses =
                reportRepository.findReportsByTargetIdWithFilter(targetId, search, pageable)
                        .map(reportMapper::toReportResponse);
        return new PagedResult<>(reportResponses);
    }

    public CommentReportDeleteResponse deleteReport(String reportId) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Comment report not found"));
        reportRepository.delete(report);
        return CommentReportDeleteResponse.builder()
                .success(true)
                .message("Comment report deleted")
                .build();
    }

    public CommentReportDeleteResponse deleteReportByTargetId(String targetId) {
        reportRepository.findReportsByTargetId(targetId).forEach(report -> {
            reportRepository.delete(report);
        });
        return CommentReportDeleteResponse.builder()
                .success(true)
                .message(String.format("Report of target id %s deleted successfully", targetId))
                .build();
    }

    public ReportUpdateResponse updateReportStatus(String reportId, ReportUpdateRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));
        try {
            report.setReportStatus(ReportStatus.valueOf(request.getStatus().toUpperCase()).name());
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_REPORT_STATUS);
        }
        report.setAdminNote(request.getAdminNote());
        report.setUpdatedAt(LocalDateTime.now());

        return reportMapper.toReportUpdateResponse(reportRepository.save(report));
    }

    public PagedResult<ReportResponse> getReportsWithFilter(String targetId, String status, String targetType, String search, Pageable pageable) {
        try {
            if (status != null) {
                status = ReportStatus.valueOf(status.toUpperCase()).name();

            }
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REPORT_STATUS);
        }
        try {
            if(targetType != null) {
                targetType = ReportTargetType.valueOf(targetType.toUpperCase()).name();
            }
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REPORT_TARGET_TYPE);
        }

        Page<ReportResponse> reportResponses =
                reportRepository.findReportsWithFilter(targetId, status, targetType, search, pageable)
                        .map(reportMapper::toReportResponse);

        return new PagedResult<>(reportResponses);
    }

    public ReportResponse getReportById(String id) {
        return reportMapper.toReportResponse(
                reportRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED))
        );
    }
}
