package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.HelpdeskTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpdeskTicketRepository extends JpaRepository<HelpdeskTicket, Long> {
    // Specific employee ki ticket history fetch karne ke liye
    // Native query: direct database column 'emp_id' se match karegi
    @Query(value = "SELECT * FROM helpdesk_tickets WHERE emp_id = :empId ORDER BY created_at DESC", nativeQuery = true)
    List<HelpdeskTicket> findByEmployeeEmpIdOrderByCreatedAtDesc(@Param("empId") Long empId);
}
