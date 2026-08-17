package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.SalaryStructureDto;
import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import com.kodekrafters.hrms_payroll_platform.repository.SalaryStructureRepository;
import com.kodekrafters.hrms_payroll_platform.service.SalaryStructureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salary-structures")
@CrossOrigin(origins = "*")
public class SalaryStructureController {
    private final SalaryStructureService salaryStructureService;
    public SalaryStructureController(SalaryStructureService salaryStructureService) {
        this.salaryStructureService = salaryStructureService;
    }
    @PostMapping
    public ResponseEntity<SalaryStructure> createSalaryStructure(@RequestBody SalaryStructure salaryStructure) {
        return ResponseEntity.ok(salaryStructureService.createSalaryStructure(salaryStructure));
    }

    @GetMapping
    public List<SalaryStructure> getAllSalaryStructures()
    {
        return salaryStructureService.getAllSalaryStructures();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryStructure> updateSalaryStructure(@PathVariable Long id, @RequestBody SalaryStructureDto dto)
    {
        return ResponseEntity.ok(salaryStructureService.updateSalaryStructure(id,dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSalaryStructure(@PathVariable Long id)
    {
        salaryStructureService.deleteSalaryStructure(id);
        return ResponseEntity.ok().build();
    }
}
