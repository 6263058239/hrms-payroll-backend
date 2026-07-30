package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.UnbilledExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnbilledExpenseRepository extends JpaRepository<UnbilledExpense, Long> {
    Optional<UnbilledExpense> findByClientClientIdAndBillingStatus(Long clientId, UnbilledExpense.BillingStatus billingStatus);
    List<UnbilledExpense> findByEmployeeEmpId(Long empId);
    List<UnbilledExpense> findByEmployeeEmpIdAndApprovalStatus(Long empId, UnbilledExpense.ApprovalStatus approvalStatus);
}

