package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.PayrollSummaryDTO;
import com.kodekrafters.hrms_payroll_platform.dto.SalaryStructureDto;
import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import com.kodekrafters.hrms_payroll_platform.repository.SalaryStructureRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryStructureServiceImpl implements SalaryStructureService{
    private final SalaryStructureRepository salaryStructureRepository;
    public SalaryStructureServiceImpl(SalaryStructureRepository salaryStructureRepository)
    {
        this.salaryStructureRepository=salaryStructureRepository;
    }

    @Override
    public SalaryStructure createSalaryStructure(SalaryStructure salaryStructure) {
        return salaryStructureRepository.save(salaryStructure);
    }

    @Override
    public List<SalaryStructure> getAllSalaryStructures() {
        return salaryStructureRepository.findAll();
    }

    @Override
    public SalaryStructure updateSalaryStructure(Long id, SalaryStructureDto dto) {
        return salaryStructureRepository.findById(id).map(sal -> {
            if (dto.getCtcAnnual() != null) sal.setCtcAnnual(dto.getCtcAnnual());
            if (dto.getBasicSalary() != null) sal.setBasicSalary(dto.getBasicSalary());
            if (dto.getDa() != null) sal.setDa(dto.getDa());
            if (dto.getHra() != null) sal.setHra(dto.getHra());
            if (dto.getConveyanceAllowance() != null) sal.setConveyanceAllowance(dto.getConveyanceAllowance());
            if (dto.getMedicalAllowance() != null) sal.setMedicalAllowance(dto.getMedicalAllowance());
            if (dto.getSpecialAllowance() != null) sal.setSpecialAllowance(dto.getSpecialAllowance());
            if (dto.getPfEmployeeContribution() != null) sal.setPfEmployeeContribution(dto.getPfEmployeeContribution());
            if (dto.getPfEmployerContribution() != null) sal.setPfEmployerContribution(dto.getPfEmployerContribution());
            if (dto.getProfessionalTax() != null) sal.setProfessionalTax(dto.getProfessionalTax());
            if (dto.getTdsIncomeTax() != null) sal.setTdsIncomeTax(dto.getTdsIncomeTax());
            return salaryStructureRepository.save(sal);
        }).orElseThrow(() -> new RuntimeException("Salary Structure not found with id: " + id));
    }


    @Override
    public void deleteSalaryStructure(Long id) {
       salaryStructureRepository.deleteById(id);
    }

    @Override
    public PayrollSummaryDTO getDashboardMetrics() {
        return salaryStructureRepository.getDashboardMetrics();
    }
}
