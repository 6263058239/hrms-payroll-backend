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

    @Column(name = "candidate_name", nullable = false, length = 150)
    private String candidateName;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private CorporateClient client;

    // ==========================================
    // 1. OFFER & JOINING DETAILS
    // ==========================================
    @Column(name = "offer_letter_ref_no", length = 100)
    private String offerLetterRefNo;

    @Column(name = "offer_date")
    private LocalDate offerDate;

    @Column(name = "expected_date_of_joining")
    private LocalDate expectedDateOfJoining;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining; // Actual joining date

    @Column(name = "candidate_ctc", nullable = false, precision = 15, scale = 2)
    private BigDecimal candidateCtc;

    @Column(name = "fee_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal feePercentage;

    // ==========================================
    // 2. PRE-ONBOARDING LIFECYCLE & VERIFICATION
    // ==========================================
    @Enumerated(EnumType.STRING)
    @Column(name = "offer_status")
    private OfferStatus offerStatus = OfferStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "background_verification_status")
    private VerificationStatus backgroundVerificationStatus = VerificationStatus.PENDING;

    @Column(name = "document_checklist_status", length = 100)
    private String documentChecklistStatus; // e.g., "PENDING", "VERIFIED", "PARTIAL"

    @Column(name = "pre_joining_formalities_status", length = 100)
    private String preJoiningFormalitiesStatus; // Bank account, UAN transfer status

    @Column(name = "onboarding_buddy_assigned")
    private String onboardingBuddyAssigned;

    @Column(name = "it_asset_request_status", length = 100)
    private String itAssetRequestStatus; // Laptop, ID card status

    // ==========================================
    // 3. AUDIT TIMESTAMPS
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

    // ==========================================
    // ENUMS FOR PRE-ONBOARDING LIFECYCLE
    // ==========================================
    public enum OfferStatus {
        ACCEPTED,
        PENDING,
        DECLINED
    }

    public enum VerificationStatus {
        PENDING,
        IN_PROGRESS,
        VERIFIED,
        FAILED
    }
}