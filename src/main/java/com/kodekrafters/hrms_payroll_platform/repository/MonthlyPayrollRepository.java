package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyPayrollRepository extends JpaRepository<MonthlyPayroll,Long> {
    // Prevents duplicate payroll batches from being generated for the same worker in a single month
    Optional<MonthlyPayroll> findByEmployeeEmpIdAndPayrollMonth(Long empId, LocalDate payrollMonth);
    // Grabs all historical payouts for a specific individual (perfect for an employee portal timeline)
    List<MonthlyPayroll> findByEmployeeEmpIdOrderByPayrollMonthDesc(Long empId);

}
