package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalaryStructureDto {
    private BigDecimal ctcAnnual;
    private BigDecimal basicSalary;
    private BigDecimal da;
    private BigDecimal hra;
    private BigDecimal conveyanceAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal specialAllowance;
    private BigDecimal pfEmployeeContribution;
    private BigDecimal pfEmployerContribution;
    private BigDecimal professionalTax;
    private BigDecimal tdsIncomeTax;
}
