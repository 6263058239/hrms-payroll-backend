package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;

import java.time.LocalDate;
import java.util.List;

public interface PayrollService {

    /**
     * Preview/Calculate monthly salary payroll without saving (Draft view).
     */
    MonthlyPayroll generateMonthlyPayroll(Long empId, LocalDate payrollMonth, Integer totalWorkingDays, Integer lossOfPayDays);

    /**
     * Calculate and persist (save) the monthly payroll into DB.
     */
    MonthlyPayroll saveMonthlyPayroll(Long empId, LocalDate payrollMonth, Integer totalWorkingDays, Integer lossOfPayDays);

    /**
     * Fetch historical payroll statements for an employee (For Payslip / History view).
     */
    List<MonthlyPayroll> getPayrollHistoryByEmployee(Long empId);

    /**
     * Update payment status (PENDING -> PAID / PROCESSED) after transaction completion.
     */
    MonthlyPayroll updatePaymentStatus(Long payrollId, MonthlyPayroll.PaymentStatus status);
}