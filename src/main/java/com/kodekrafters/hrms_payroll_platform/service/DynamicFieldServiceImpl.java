package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.DynamicFieldDto;
import com.kodekrafters.hrms_payroll_platform.entity.DynamicFieldConfig;
import com.kodekrafters.hrms_payroll_platform.repository.DynamicFieldConfigRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DynamicFieldServiceImpl implements DynamicFieldService{
    private final DynamicFieldConfigRepository dynamicFieldConfigRepository;

    public DynamicFieldServiceImpl(DynamicFieldConfigRepository dynamicFieldConfigRepository)
    {
        this.dynamicFieldConfigRepository=dynamicFieldConfigRepository;
    }

    @Override
    public List<DynamicFieldConfig> getAllFields() {
        return dynamicFieldConfigRepository.findAll();
    }

    @Override
    public DynamicFieldConfig createField(DynamicFieldDto dto) {
        DynamicFieldConfig config=new DynamicFieldConfig();
        config.setFieldLabel(dto.getFieldLabel());
        config.setFieldKey(dto.getFieldKey());
        config.setFieldCategory(dto.getFieldCategory());
        config.setDataType(dto.getDataType());
        config.setIsRequired(dto.getIsRequired() != null ? dto.getIsRequired() : false);
        config.setDefaultValue(dto.getDefaultValue());
        config.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        return dynamicFieldConfigRepository.save(config);
    }

    @Override
    public void deleteField(Long id) {
dynamicFieldConfigRepository.deleteById(id);
    }
}
