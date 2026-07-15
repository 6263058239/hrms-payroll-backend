package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;

import java.time.LocalDate;

public interface PayrollService {
    /**
     * Calculates, processes, and persists the monthly salary payroll record for a worker.
     * Applies attendance-based proration limits and statutory Indian tax deductions.
     *
     * @param empId            The unique identifier key of the target employee
     * @param payrollMonth            The target month for which payroll is running (e.g. 2026-06-01)
     * @param totalWorkingDays The total billable/working days in that month calendar
     * @param lossOfPayDays    The absolute number of days the employee was absent without pay
     * @return Generated and saved MonthlyPayroll transactional entity object
     */
    MonthlyPayroll generateMonthlyPayroll(Long empId, LocalDate payrollMonth, int totalWorkingDays, int lossOfPayDays);
}
