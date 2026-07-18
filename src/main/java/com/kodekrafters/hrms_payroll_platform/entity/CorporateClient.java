package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(length = 100)
    private String country;

    @Column(name = "billing_currency",length = 10)
    private String billingCurrency;

    // --- LOGIN AUR SIGNUP KE LIYE YEH DO FIELDS ADD KAR DI HAIN ---
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;
}
