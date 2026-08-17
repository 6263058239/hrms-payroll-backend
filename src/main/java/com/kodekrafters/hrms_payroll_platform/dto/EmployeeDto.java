package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private String employeeName;
    private String officialEmail;
    private String contactNumber;
    private String department;
    private String designation;
}
