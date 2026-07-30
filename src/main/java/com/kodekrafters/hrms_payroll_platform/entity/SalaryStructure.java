package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_structures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "emp_id", nullable = false, unique = true)
    private Employee employee;

    // ==========================================
    // 1. OVERALL CTC & BASE COMPONENTS
    // ==========================================
    @Column(name = "ctc_annual", precision = 15, scale = 2)
    private BigDecimal ctcAnnual; // Annual CTC

    @Column(name = "basic_salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 15, scale = 2)
    private BigDecimal da; // Dearness Allowance

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal hra; // House Rent Allowance

    // ==========================================
    // 2. ADDITIONAL ALLOWANCES (✨ NEW)
    // ==========================================
    @Column(name = "conveyance_allowance", precision = 15, scale = 2)
    private BigDecimal conveyanceAllowance;

    @Column(name = "medical_allowance", precision = 15, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(name = "special_allowance", precision = 15, scale = 2)
    private BigDecimal specialAllowance;

    @Column(name = "overtime_hourly_rate", precision = 10, scale = 2)
    private BigDecimal overtimeHourlyRate;

    // ==========================================
    // 3. STATUTORY CONTRIBUTION & DEDUCTIONS
    // ==========================================
    @Column(name = "pf_employee_contribution", precision = 12, scale = 2)
    private BigDecimal pfEmployeeContribution; // Employee Share (Deduction)

    @Column(name = "pf_employer_contribution", precision = 12, scale = 2)
    private BigDecimal pfEmployerContribution; // Employer Share (Cost to Company)

    @Column(name = "professional_tax", precision = 10, scale = 2)
    private BigDecimal professionalTax;

    @Column(name = "tds_income_tax", precision = 12, scale = 2)
    private BigDecimal tdsIncomeTax;

    // ==========================================
    // 4. CONFIGURATION & EFFECTIVE DATES (✨ NEW)
    // ==========================================
    @Column(name = "currency", length = 10)
    private String currency = "INR"; // Default INR

    @Column(name = "pay_frequency", length = 20)
    private String payFrequency = "MONTHLY"; // MONTHLY, WEEKLY, BI-WEEKLY

    @Column(name = "effective_date")
    private LocalDate effectiveDate; // Revisions tracking

    // ==========================================
    // 5. AUDIT TIMESTAMPS
    // ==========================================
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}