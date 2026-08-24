package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee_EmpId(Long empId);

    List<LeaveRequest> findByEmployee_EmpIdAndApprovalStatus(Long empId, LeaveRequest.ApprovalStatus status);

    List<LeaveRequest> findByApprovalStatus(LeaveRequest.ApprovalStatus status);

    // ✨ Ye method add kiya: Overlapping approved leaves check karne ke liye
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.empId = :empId " +
            "AND lr.approvalStatus = 'APPROVED' " +
            "AND lr.fromDate <= :endDate AND lr.toDate >= :startDate")
    List<LeaveRequest> findOverlappingApprovedLeaves(@Param("empId") Long empId,
                                                     @Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    @Modifying
    @Query("DELETE FROM LeaveRequest lr WHERE lr.employee.empId = :empId")
    void deleteByEmployee_EmpId(@Param("empId") Long empId);

}
