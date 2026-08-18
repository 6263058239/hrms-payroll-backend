package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.EmployeeDto;
import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService{
    private final EmployeeRepository employeeRepository;
    public EmployeeServiceImpl(EmployeeRepository employeeRepository)
    {
        this.employeeRepository=employeeRepository;
    }


    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Employee Not Found With This ID:"+id));
    }

    @Override
    public Employee updateEmployee(Long id, EmployeeDto dto) {
        return employeeRepository.findById(id).map(emp -> {
            if (dto.getEmployeeName() != null) emp.setEmployeeName(dto.getEmployeeName());
            if (dto.getOfficialEmail() != null) emp.setOfficialEmail(dto.getOfficialEmail());
            if (dto.getContactNumber() != null) emp.setContactNumber(dto.getContactNumber());
            if (dto.getDepartment() != null) emp.setDepartment(dto.getDepartment());
            if (dto.getDesignation() != null) emp.setDesignation(dto.getDesignation());
            return employeeRepository.save(emp);
        }).orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
