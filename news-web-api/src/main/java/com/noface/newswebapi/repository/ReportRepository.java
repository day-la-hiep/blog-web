package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ReportRepository extends JpaRepository<Report, String> {


    List<Report> findReportsById(String id);

    List<Report> findReportsByTargetId(String targetId);

    @Query("""
        select r 
        from Report r
        where r.targetId = :targetId
        and (:search is null or lower(r.reason) like lower(concat('%', :search, '%'))
         or lower(r.detail) like lower(concat('%', :search, '%'))
         or lower(r.author.username) like lower(concat('%', :search, '%'))
         or lower(r.author.firstName) like lower(concat('%', :search, '%'))
         or lower(r.author.lastName) like lower(concat('%', :search, '%')))

""")
    Page<Report> findReportsByTargetIdWithFilter(String targetId, String search, Pageable pageable);
    @Query("""
        select r 
        from Report r
        where (:search is null or lower(r.reason) like lower(concat('%', :search, '%'))
         or lower(r.detail) like lower(concat('%', :search, '%'))
         or lower(r.author.username) like lower(concat('%', :search, '%'))
         or lower(r.author.firstName) like lower(concat('%', :search, '%'))
         or lower(r.author.lastName) like lower(concat('%', :search, '%')))
        and (:status is null or r.reportStatus = :status)
        and (:startDate is null or r.createdAt >= :startDate)
        and (:endDate is null or r.createdAt <= :endDate)
        and (:targetType is null or r.targetType = :targetType)
        and (:targetId is null or r.targetId = :targetId)

""")
    Page<Report> findReportsWithFilter(String targetId, String status, String targetType, String search, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
