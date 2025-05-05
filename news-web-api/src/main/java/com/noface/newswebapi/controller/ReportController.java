package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.ApiResponse;
import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.report.*;
import com.noface.newswebapi.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping("/reports")
    public ApiResponse<ReportCreateResponse> createReport(
            @RequestBody ReportCreateRequest request
    ) {
        return ApiResponse.<ReportCreateResponse>builder()
                .result(reportService.createReport(request))
                .build();
    }
    @GetMapping("/reports/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<ReportResponse> getDetailReport(
            @PathVariable("id") String id
    ) {
        return ApiResponse.<ReportResponse>builder()
                .result(reportService.getReportById(id))
                .build();
    }
    @GetMapping("/reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<PagedResult<ReportResponse>> getReports(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "-createdAt") String sortBy,
            @RequestParam(required = false) String targetId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String targetType
            ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(
                        Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", "").trim()
                ));
        return ApiResponse.<PagedResult<ReportResponse>>builder()
                .result(reportService.getReportsWithFilter(targetId, status, targetType, search, pageable))
                .build();
    }

    @DeleteMapping("/reports/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CommentReportDeleteResponse> deleteReport(
            @PathVariable("id") String id
    ) {
        return ApiResponse.<CommentReportDeleteResponse>builder()
                .result(reportService.deleteReport(id))
                .build();
    }



    @DeleteMapping("/reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CommentReportDeleteResponse> deleteReportsByTargetId(
            @PathVariable("targetId") String targetId
    ) {
        return ApiResponse.<CommentReportDeleteResponse>builder()
                .result(reportService.deleteReportByTargetId(targetId))
                .build();
    }

    @PutMapping("/reports/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<ReportUpdateResponse> updateReport(

            @PathVariable String id,
            @RequestBody ReportUpdateRequest request
    ){
        return ApiResponse.<ReportUpdateResponse>builder()
                .result(reportService.updateReportStatus(id, request))
                .build();
    }
}
