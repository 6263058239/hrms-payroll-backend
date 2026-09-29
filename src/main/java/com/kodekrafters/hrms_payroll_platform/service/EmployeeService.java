package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.EmployeeDto;
import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface EmployeeService {
    Employee createEmployee(Employee employee);
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee updateEmployee(Long id, EmployeeDto dto);
    void deleteEmployee(Long id);

    // ⚡ Naye methods ESS Profile & Document Upload ke liye
    Employee updateProfile(Long id, Map<String, String> payload);
    String uploadDocument(Long id, String docType, MultipartFile file) throws IOException;
}

