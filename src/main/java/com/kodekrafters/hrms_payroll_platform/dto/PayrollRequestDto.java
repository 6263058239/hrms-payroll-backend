package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PayrollRequestDto {
    private Long empId;
    private LocalDate payrollMonth;
    private Integer totalWorkingDays;
    private Integer lossOfPayDays;
}
