package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.AdminLoginRequestDto;

import java.util.Map;

public interface AdminService {
    Map<String,Object> authenticateAdmin(AdminLoginRequestDto loginRequestDto);
}
