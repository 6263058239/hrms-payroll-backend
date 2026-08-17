package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leave_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false, unique = true, length = 50)
    private String typeName; // CASUAL, SICK, EARNED, MATERNITY

    @Column(name = "max_days_per_year")
    private Integer maxDaysPerYear;

    @Column(name = "is_paid", nullable = false)
    @Builder.Default
    private boolean paid = true;

    @Column(name = "carry_forward_allowed", nullable = false)
    @Builder.Default
    private boolean carryForwardAllowed = false;
}