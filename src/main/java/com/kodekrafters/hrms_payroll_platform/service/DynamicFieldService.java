package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.DynamicFieldDto;
import com.kodekrafters.hrms_payroll_platform.entity.DynamicFieldConfig;

import java.util.List;

public interface DynamicFieldService {
    List<DynamicFieldConfig> getAllFields();
    DynamicFieldConfig createField(DynamicFieldDto dto);
    void deleteField(Long id);
}
