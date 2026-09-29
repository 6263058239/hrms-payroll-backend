package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "helpdesk_tickets")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HelpdeskTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "emp_id",nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "helpdeskTickets", "leaveRequests", "attendanceRecords"})
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false) // PAYROLL_SALARY, ATTENDANCE_LEAVE, KYC_PROFILE, GENERAL
    private TicketCategory ticketCategory;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "description", length = 1000, nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private TicketPriority priority = TicketPriority.MEDIUM; // LOW, MEDIUM, HIGH, URGENT

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TicketStatus status = TicketStatus.OPEN; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Column(name = "resolution_remarks", length = 1000)
    private String resolutionRemarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public enum TicketCategory{ PAYROLL_SALARY, ATTENDANCE_LEAVE, KYC_PROFILE, GENERAL_QUERY}
    public enum TicketPriority{ LOW, MEDIUM, HIGH, URGENT }
    public enum TicketStatus { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
}
