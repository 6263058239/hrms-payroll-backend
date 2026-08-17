package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.dto.PayrollSummaryDTO;
import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure,Long> {
    Optional<SalaryStructure> findByEmployeeEmpId(Long empId);
    @Query("SELECT new com.kodekrafters.hrms_payroll_platform.dto.PayrollSummaryDTO(" +
            "COUNT(s), " +
            "SUM(COALESCE(s.basicSalary, 0) + COALESCE(s.da, 0) + COALESCE(s.hra, 0) + COALESCE(s.specialAllowance, 0) + COALESCE(s.conveyanceAllowance, 0) + COALESCE(s.medicalAllowance, 0)), " +
            "SUM(COALESCE(s.pfEmployeeContribution, 0) + COALESCE(s.tdsIncomeTax, 0) + COALESCE(s.professionalTax, 0))) " +
            "FROM SalaryStructure s")
    PayrollSummaryDTO getDashboardMetrics();
}
