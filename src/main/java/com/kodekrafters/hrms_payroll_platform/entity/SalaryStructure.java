package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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

    @Column(name = "basic_salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 15, scale = 2)
    private BigDecimal da;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal hra;

    @Column(name = "special_allowance", precision=15, scale = 2)
    private BigDecimal specialAllowance;

    @Column(name = "pf_employee_contribution", precision = 12,scale = 2)
    private BigDecimal pfEmployeeContribution;

    @Column(name = "pf_employee_deduction", precision = 12, scale = 2)
    private BigDecimal pfEmployeeDeduction;

    @Column(name = "professional_tax", precision = 10, scale = 2)
    private BigDecimal professionalTax;
}
