package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.entity.LeaveRequest;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import com.kodekrafters.hrms_payroll_platform.repository.LeaveBalanceRepository;
import com.kodekrafters.hrms_payroll_platform.repository.LeaveRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService{
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestServiceImpl(LeaveRequestRepository leaveRequestRepository, LeaveBalanceRepository leaveBalanceRepository, EmployeeRepository employeeRepository)
    {
        this.leaveRequestRepository=leaveRequestRepository;
        this.leaveBalanceRepository=leaveBalanceRepository;
        this.employeeRepository=employeeRepository;
    }

    @Override
    @Transactional
    public LeaveRequest applyLeave(LeaveRequest request, Long empId) {
        Employee employee=employeeRepository.findById(empId)
                .orElseThrow(()-> new RuntimeException("Employee not found with ID:"+empId));
        // 1. Overlap Check (Claude's enterprise rule)
        List<LeaveRequest> overlappingLeaves = leaveRequestRepository.findOverlappingApprovedLeaves(
                empId,
                request.getFromDate(),
                request.getToDate()
        );
        if (!overlappingLeaves.isEmpty()){
            throw new RuntimeException("Leave application rejected: Approved leave already exists in this date range");
        }
        request.setEmployee(employee);
        request.setApprovalStatus(LeaveRequest.ApprovalStatus.PENDING);
        return leaveRequestRepository.save(request);
    }

    @Override
    @Transactional
    public LeaveRequest approveLeave(Long leaveRequestId, Long approverEmpId, String remarks) {
        LeaveRequest leaveRequest=leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(()-> new RuntimeException("Leave request not found with ID:"+leaveRequestId));

        Employee approver= employeeRepository.findById(approverEmpId)
                .orElseThrow(()-> new RuntimeException("Approver not found with ID:"+approverEmpId));
        leaveRequest.setApprovalStatus(LeaveRequest.ApprovalStatus.APPROVED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApproverRemarks(remarks);

        // Deduct from Leave Balance ledger if record exists for current year
        int currentYear= LocalDate.now().getYear();
        leaveBalanceRepository.findByEmployee_EmpIdAndYear(leaveRequest.getEmployee().getEmpId(), currentYear)
                .stream().findFirst().ifPresent(balance -> {
                    BigDecimal days = BigDecimal.valueOf(leaveRequest.getNumberOfDays());
                    BigDecimal newUsed = (balance.getUsedDays() != null ? balance.getUsedDays() : BigDecimal.ZERO).add(days);
                    BigDecimal newRemaining = (balance.getRemainingDays() != null ? balance.getRemainingDays() : BigDecimal.ZERO).subtract(days);

                    balance.setUsedDays(newUsed);
                    balance.setRemainingDays(newRemaining);
                    leaveBalanceRepository.save(balance);
                });
        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    @Transactional
    public LeaveRequest rejectLeave(Long leaveRequestId, Long approverEmpId, String remarks) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave Request not found with ID: " + leaveRequestId));

        Employee approver = employeeRepository.findById(approverEmpId)
                .orElseThrow(() -> new RuntimeException("Approver not found with ID: " + approverEmpId));

        leaveRequest.setApprovalStatus(LeaveRequest.ApprovalStatus.REJECTED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApproverRemarks(remarks);

        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public List<LeaveRequest> getEmployeeLeaves(Long empId) {
        return leaveRequestRepository.findByEmployee_EmpId(empId);
    }

    @Override
    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByApprovalStatus(LeaveRequest.ApprovalStatus.PENDING);
    }
}
