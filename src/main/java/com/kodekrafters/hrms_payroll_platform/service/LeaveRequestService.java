package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.LeaveRequest;

import java.util.List;

public interface LeaveRequestService {
    LeaveRequest applyLeave(LeaveRequest request, Long empId);
    LeaveRequest approveLeave(Long leaveRequestId, Long approverEmpId, String remarks);
    LeaveRequest rejectLeave(Long leaveRequestId, Long approverEmpId, String remarks);
    List<LeaveRequest> getEmployeeLeaves(Long empId);
    List<LeaveRequest> getPendingLeaves();
}
