package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.EmployeeExit;

import java.util.List;
import java.util.Map;

public interface EmployeeExitService {
    EmployeeExit applyResignation(Long empId, Map<String, String> payload);
    EmployeeExit getExitDetailsByEmpId(Long empId);
    List<EmployeeExit> getAllExitRequests();
    EmployeeExit updateClearanceAndSettlement(Long exitId, Map<String, Object> payload);
}
