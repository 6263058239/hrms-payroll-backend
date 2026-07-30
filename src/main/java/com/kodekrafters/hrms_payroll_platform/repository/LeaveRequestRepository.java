package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee_EmpId(Long empId);

    List<LeaveRequest> findByEmployee_EmpIdAndApprovalStatus(Long empId, LeaveRequest.ApprovalStatus status);

    List<LeaveRequest> findByApprovalStatus(LeaveRequest.ApprovalStatus status);
}
