package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.EmployeeExit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeExitRepository extends JpaRepository<EmployeeExit,Long> {
    Optional<EmployeeExit> findByEmployee_EmpId(Long empId);
}
