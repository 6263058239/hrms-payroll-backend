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
@Table(name = "client_invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private CorporateClient client;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate; // Payment due date (e.g. Net 30)

    @Column(name = "billing_currency", length = 10)
    private String billingCurrency;

    @Column(name = "exchange_rate_booked", precision = 10, scale = 4)
    private BigDecimal exchangeRateBooked;

    @Column(name = "net_amount_native", nullable = false, precision = 15, scale = 2)
    private BigDecimal netAmountNative;

    @Column(name = "net_amount_inr", nullable = false, precision = 15, scale = 2)
    private BigDecimal netAmountInr;

    @Column(name = "gst_value", precision = 12, scale = 2)
    private BigDecimal gstValue;

    @Column(name = "total_invoice_value_with_gst", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalInvoiceValueWithGst;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_received_status")
    private InvoiceStatus paymentReceivedStatus = InvoiceStatus.UNPAID;

    @Column(name = "payment_receipt_date")
    private LocalDate paymentReceiptDate;

    @Column(name = "actual_payment_value_received", precision = 15, scale = 2)
    private BigDecimal actualPaymentValueReceived;

    @Column(name = "variance_due_to_tds_or_fees", precision = 15, scale = 2)
    private BigDecimal varianceDueToTdsOrFees;

    @Column(name = "invoice_pdf_url", length = 500)
    private String invoicePdfUrl; // External PDF / Zoho Link

    // ==========================================
    // AUDIT TIMESTAMPS
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

    public enum InvoiceStatus {
        UNPAID, PAID, PARTIALLY_PAID, OVERDUE, BAD_DEBT
    }
}