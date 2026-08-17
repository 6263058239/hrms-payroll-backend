package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayrollSummaryDTO {
    private Long totalEmployees;
    private BigDecimal totalPayrollCost;
    private BigDecimal totalStatutoryDeductions;
}
