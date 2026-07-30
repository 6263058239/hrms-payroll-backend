package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PayrollRequestDto {
    private Long empId;
    private LocalDate payrollMonth;
    private Integer totalWorkingDays;
    private Integer lossOfPayDays;
}


