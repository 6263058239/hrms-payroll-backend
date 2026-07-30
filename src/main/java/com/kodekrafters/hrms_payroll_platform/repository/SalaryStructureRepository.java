package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure,Long> {
    Optional<SalaryStructure> findByEmployeeEmpId(Long empId);
}
