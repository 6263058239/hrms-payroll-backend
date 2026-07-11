package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.ClientInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientInvoiceRepository extends JpaRepository<ClientInvoice,Long> {
    Optional<ClientInvoice> findByInvoiceNumber(String invoiceNumber);
    // Presentation Highlight: Instantly pulls all invoices facing payment leaks/shortfalls
    @Query("SELECT c FROM ClientInvoice c WHERE c.varianceDueToTdsOrFees != 0")
    List<ClientInvoice> findAllInvoicesWithLeakageVariances();
}
