package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "monthly_payroll_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPayroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Column(name = "payroll_month", nullable = false)
    private LocalDate payrollMonth;

    @Column(name = "total_working_days", nullable = false)
    private Integer totalWorkingDays;

    @Column(name = "loss_of_pay_days")
    private Integer lossOfPayDays;

    @Column(name = "gross_earned", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossEarned;

    @Column(name = "tds_deduction", precision = 12, scale = 2)
    private BigDecimal tdsDeduction;

    @Column(name = "advance_deduction", precision = 12, scale = 2)
    private BigDecimal advanceDeduction;

    @Column(name = "net_payable", nullable = false, precision = 15, scale = 2)
    private BigDecimal netPayable;

    @Column(name = "actual_paid", nullable = false, precision = 15, scale = 2)
    private BigDecimal actualPaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    public enum PaymentStatus {
        PENDING, PARTIAL, PAID
    }

}
