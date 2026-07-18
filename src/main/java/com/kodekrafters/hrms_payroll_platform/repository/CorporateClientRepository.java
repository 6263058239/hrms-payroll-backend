package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.CorporateClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CorporateClientRepository extends JpaRepository<CorporateClient,Long> {
    Optional<CorporateClient> findByCompanyName(String companyName);

    // Signup ke waqt duplicate email check karne ke liye
    Optional<CorporateClient> findByEmail(String email);

    // Login ke waqt email aur password match karne ke liye
    Optional<CorporateClient> findByEmailAndPassword(String email, String password);

}
