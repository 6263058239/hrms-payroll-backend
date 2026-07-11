package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.RecruitedCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruitedCandidateRepository extends JpaRepository<RecruitedCandidate, Long> {
    Optional<RecruitedCandidate> findByClientClientId(Long clientId);
}
