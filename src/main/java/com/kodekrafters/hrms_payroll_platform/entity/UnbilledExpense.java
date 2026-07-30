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
@Table(name = "unbilled_reimbursable_expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnbilledExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Long expenseId;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private CorporateClient client; // Optional (agar client-billable nahi hai toh null reh sakta hai)

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "bank_utr_number", unique = true, length = 100)
    private String bankUtrNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false)
    private ExpenseType expenseType;

    @Column(name = "description", length = 500)
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "gst_paid", precision = 12, scale = 2)
    private BigDecimal gstPaid;

    @Column(name = "total_reimbursable_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalReimbursableCost;

    // ==========================================
    // 1. APPROVAL & PAYROLL INTEGRATION (✨ NEW)
    // ==========================================
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "receipt_document_url", length = 500)
    private String receiptDocumentUrl; // Supporting documents URL

    @ManyToOne
    @JoinColumn(name = "reimbursed_in_payroll_id")
    private MonthlyPayroll reimbursedInPayroll; // Linked to the pay cycle where it was paid

    // ==========================================
    // 2. CLIENT BILLING TRACKING
    // ==========================================
    @Enumerated(EnumType.STRING)
    @Column(name = "billing_status")
    private BillingStatus billingStatus = BillingStatus.PENDING_INVOICE;

    @ManyToOne
    @JoinColumn(name = "linked_invoice_number", referencedColumnName = "invoice_number")
    private ClientInvoice linkedInvoice;

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
    // ENUMS
    // ==========================================
    public enum ExpenseType {
        TRAVEL_ADVANCE,
        PER_DIEM,
        CLIENT_ENTERTAINMENT,
        MEDICAL,
        INTERNET_OR_UTILITIES,
        OTHER
    }

    public enum BillingStatus {
        PENDING_INVOICE,
        INVOICED,
        NON_REIMBURSABLE
    }

    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED,
        REIMBURSED
    }
}