package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    @JoinColumn(name = "client_id", nullable = false)
    private CorporateClient client;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "bank_utr_number", unique = true, length = 100)
    private String bankUtrNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false)
    private ExpenseType expenseType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "gst_paid", precision = 12, scale = 2)
    private BigDecimal gstPaid;

    @Column(name = "total_reimbursable_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalReimbursableCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_status")
    private BillingStatus billingStatus;

    @ManyToOne
    @JoinColumn(name = "linked_invoice_number", referencedColumnName = "invoice_number")
    private ClientInvoice linkedInvoice;

    public enum ExpenseType {
        TRAVEL_ADVANCE, PER_DIEM, CLIENT_ENTERTAINMENT, OTHER
    }

    public enum BillingStatus {
        PENDING_INVOICE, INVOICED, NON_REIMBURSABLE
    }
}
