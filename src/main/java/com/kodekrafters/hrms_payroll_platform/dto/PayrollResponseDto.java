package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PayrollResponseDto {
    // Basic Employee Info for Identification
    private Long empId;
    private String employeeName;
    private String department;

    // Time & Attendance Metadata
    private LocalDate payrollMonth;
    private Integer totalWorkingDays;
    private Integer lossOfPayDays;
    private Integer netPaidDays;

    // Financial Breakdown Metrics (2-Decimal Formatted)
    private BigDecimal grossEarned;
    private BigDecimal professionalTaxDeduction;
    private BigDecimal providentFundDeduction;
    private BigDecimal totalDeductions;
    private BigDecimal netTakeHomePay;

    // Workflow State
    private String paymentStatus;
}
