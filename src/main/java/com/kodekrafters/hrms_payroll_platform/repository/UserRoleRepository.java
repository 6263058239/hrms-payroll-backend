package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole,Long> {
    Optional<UserRole> findByUsername(String username);

    boolean existsByUsername(String username);
}
