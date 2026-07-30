package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "corporate_clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorporateClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Long clientId;

    @Column(name = "company_name", nullable = false, unique = true, length = 150)
    private String companyName;

    // --- LOGIN AUR AUTHENTICATION DETAILS ---
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    // ==========================================
    // 1. CONTACT & ADDRESS DETAILS (✨ NEW)
    // ==========================================
    @Column(name = "contact_person_name", length = 100)
    private String contactPersonName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "registered_address", length = 500)
    private String registeredAddress;

    @Column(length = 100)
    private String country;

    // ==========================================
    // 2. TAX & BILLING CONFIGURATION (✨ NEW)
    // ==========================================
    @Column(name = "gstin_or_tax_id", length = 50)
    private String gstinOrTaxId; // GSTIN for India or Tax ID

    @Column(name = "billing_currency", length = 10)
    private String billingCurrency = "INR"; // Default INR

    @Column(name = "payment_terms_days")
    private Integer paymentTermsDays = 30; // e.g., Net 30 days

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
}