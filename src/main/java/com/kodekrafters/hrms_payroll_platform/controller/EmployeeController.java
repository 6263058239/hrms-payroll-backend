package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.EmployeeDto;
import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import com.kodekrafters.hrms_payroll_platform.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    private final EmployeeService employeeService; // Dynamic handling ke liye Direct Repository ya Service call

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @GetMapping
    public List<Employee> getAllEmployees()
    {
        return employeeService.getAllEmployees();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto dto)
    {
        return ResponseEntity.ok(employeeService.updateEmployee(id,dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id)
    {
      employeeService.deleteEmployee(id);
      return ResponseEntity.ok().build();
    }
}
