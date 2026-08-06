package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.DynamicFieldDto;
import com.kodekrafters.hrms_payroll_platform.entity.DynamicFieldConfig;
import com.kodekrafters.hrms_payroll_platform.service.DynamicFieldService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dynamic-fields")
@CrossOrigin(origins = "*")
public class DynamicFieldConfigController {
    private final DynamicFieldService dynamicFieldService;

    public DynamicFieldConfigController(DynamicFieldService dynamicFieldService)
    {
        this.dynamicFieldService=dynamicFieldService;
    }

    @GetMapping
    public List<DynamicFieldConfig> getAllFields()
    {
        return dynamicFieldService.getAllFields();
    }

    @PostMapping
    public ResponseEntity<DynamicFieldConfig> createField(@RequestBody DynamicFieldDto dto)
    {
        return ResponseEntity.ok(dynamicFieldService.createField(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteField(@PathVariable Long id)
    {
        dynamicFieldService.deleteField(id);
        return ResponseEntity.ok().build();
    }
}
