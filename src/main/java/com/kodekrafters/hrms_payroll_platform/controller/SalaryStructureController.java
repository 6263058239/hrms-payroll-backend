package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import com.kodekrafters.hrms_payroll_platform.repository.SalaryStructureRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/salary-structures")
@CrossOrigin(origins = "*")
public class SalaryStructureController {
    private final SalaryStructureRepository salaryStructureRepository;
    public SalaryStructureController(SalaryStructureRepository salaryStructureRepository) {
        this.salaryStructureRepository = salaryStructureRepository;
    }
    @PostMapping
    public ResponseEntity<SalaryStructure> createSalaryStructure(@RequestBody SalaryStructure salaryStructure) {
        SalaryStructure savedSalary = salaryStructureRepository.save(salaryStructure);
        return ResponseEntity.ok(savedSalary);
    }
}
