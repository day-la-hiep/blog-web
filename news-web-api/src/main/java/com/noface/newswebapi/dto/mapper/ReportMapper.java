package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.report.ReportCreateResponse;
import com.noface.newswebapi.dto.report.ReportResponse;
import com.noface.newswebapi.dto.report.ReportUpdateResponse;
import com.noface.newswebapi.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")

public interface ReportMapper {
    @Mapping(target = "authorUsername", source = "author.username")
    ReportCreateResponse toReportCreateResponse(Report report);
    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "status", source = "reportStatus")
    ReportResponse toReportResponse(Report report);

    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "status", source = "reportStatus")
    ReportUpdateResponse toReportUpdateResponse(Report report);
}
