package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.CorporateClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CorporateClientRepository extends JpaRepository<CorporateClientRepository,Long> {
    Optional<CorporateClient> findByCompanyName(String companyName);
}
