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
@Table(name = "employee_exits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeExit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "emp_id", nullable = false, unique = true)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "exit_type")
    private ExitType exitType; // RESIGNATION, TERMINATION, RETIREMENT

    @Column(name = "resignation_date")
    private LocalDate resignationDate;

    @Column(name = "last_working_day")
    private LocalDate lastWorkingDay;

    @Column(name = "notice_period_days_required")
    private Integer noticePeriodDaysRequired;

    @Column(name = "notice_period_days_served")
    private Integer noticePeriodDaysServed;

    // --- FULL & FINAL (F&F) CALCULATIONS ---
    @Column(name = "pending_salary_amount", precision = 15, scale = 2)
    private BigDecimal pendingSalaryAmount;

    @Column(name = "leave_encashment_amount", precision = 15, scale = 2)
    private BigDecimal leaveEncashmentAmount;

    @Column(name = "gratuity_amount", precision = 15, scale = 2)
    private BigDecimal gratuityAmount;

    @Column(name = "notice_shortfall_deduction", precision = 15, scale = 2)
    private BigDecimal noticeShortfallDeduction;

    @Column(name = "final_settlement_amount", precision = 15, scale = 2)
    private BigDecimal finalSettlementAmount;

    @Column(name = "asset_clearance_done")
    private Boolean assetClearanceDone = false;

    @Column(name = "no_dues_cleared")
    private Boolean noDuesCleared = false;

    @Column(name = "settlement_payment_date")
    private LocalDate settlementPaymentDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum ExitType {
        RESIGNATION,
        TERMINATION,
        RETIREMENT,
        END_OF_CONTRACT
    }
}
