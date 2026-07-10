package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "recruited_candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruitedCandidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_id")
    private Long candidateId;

    @Column(name = "candidate_name", nullable = false,length = 150)
    private String candidateName;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private CorporateClient client;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;

    @Column(name = "candidate_ctc", nullable = false, precision = 15, scale = 2)
    private BigDecimal candidateCtc;

    @Column(name = "fee_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal feePercentage;
}
