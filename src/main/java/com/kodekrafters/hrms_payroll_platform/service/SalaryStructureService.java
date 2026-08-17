package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.PayrollSummaryDTO;
import com.kodekrafters.hrms_payroll_platform.dto.SalaryStructureDto;
import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;

import java.util.List;

public interface SalaryStructureService {
    SalaryStructure createSalaryStructure(SalaryStructure salaryStructure);
    List<SalaryStructure> getAllSalaryStructures();
    SalaryStructure updateSalaryStructure(Long id, SalaryStructureDto dto);
    void deleteSalaryStructure(Long id);
    public PayrollSummaryDTO getDashboardMetrics();
}
