package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance,Long> {
    Optional<LeaveBalance> findByEmployee_EmpIdAndLeaveType_IdAndYear(Long empId, Long leaveTypeId, int year);

    List<LeaveBalance> findByEmployee_EmpIdAndYear(Long empId, int year);
}
