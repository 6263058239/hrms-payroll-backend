package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.PayrollRequestDto;
import com.kodekrafters.hrms_payroll_platform.dto.PayrollResponseDto;
import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;
import com.kodekrafters.hrms_payroll_platform.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {
private final PayrollService payrollService;
public PayrollController(PayrollService payrollService)
{
    this.payrollService=payrollService;
}
@PostMapping("/generate")
public ResponseEntity<PayrollResponseDto> generatePayroll(@RequestBody PayrollRequestDto payrollRequestDto)
{
MonthlyPayroll payroll=payrollService.generateMonthlyPayroll(
        payrollRequestDto.getEmpId(),
        payrollRequestDto.getPayrollMonth(),
        payrollRequestDto.getTotalWorkingDays(),
        payrollRequestDto.getLossOfPayDays()
      );
return ResponseEntity.ok(mapToResponseDto(payroll));
}
/**
 * 2. FINALIZE & PERSIST PAYROLL (Save to DB)
 */
@PostMapping("/finalize")
public ResponseEntity<PayrollResponseDto> finalizeAndSavePayroll(@RequestBody PayrollRequestDto payrollRequestDto)
{
    MonthlyPayroll savedPayroll = payrollService.saveMonthlyPayroll(
            payrollRequestDto.getEmpId(),
            payrollRequestDto.getPayrollMonth(),
            payrollRequestDto.getTotalWorkingDays(),
            payrollRequestDto.getLossOfPayDays()
    );
    return ResponseEntity.ok(mapToResponseDto(savedPayroll));
}
    @GetMapping("/employee/{empId}")
public ResponseEntity<List<PayrollResponseDto>> getPayrollHistory(@PathVariable Long empId)
{
 List<MonthlyPayroll> payrolls=payrollService.getPayrollHistoryByEmployee(empId);
    List<PayrollResponseDto> responseList = payrolls.stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    return ResponseEntity.ok(responseList);
}
    @PatchMapping("/{payrollId}/status")
    public ResponseEntity<PayrollResponseDto> updateStatus(
            @PathVariable Long payrollId,
            @RequestParam MonthlyPayroll.PaymentStatus status) {

        MonthlyPayroll updatedPayroll = payrollService.updatePaymentStatus(payrollId, status);
        return ResponseEntity.ok(mapToResponseDto(updatedPayroll));
    }
    // Helper Method: Entity to Response DTO Mapping
    private PayrollResponseDto mapToResponseDto(MonthlyPayroll payroll) {
        int netPaidDays = payroll.getTotalWorkingDays() - (payroll.getLossOfPayDays() != null ? payroll.getLossOfPayDays() : 0);

        // Baseline structure se PT aur PF ki exact value read kar rahe hain
        BigDecimal pt = (payroll.getEmployee().getSalaryStructure() != null && payroll.getEmployee().getSalaryStructure().getProfessionalTax() != null)
                ? payroll.getEmployee().getSalaryStructure().getProfessionalTax() : BigDecimal.ZERO;
        BigDecimal pf = (payroll.getEmployee().getSalaryStructure() != null && payroll.getEmployee().getSalaryStructure().getPfEmployeeContribution() != null)
                ? payroll.getEmployee().getSalaryStructure().getPfEmployeeContribution() : BigDecimal.ZERO;

        return PayrollResponseDto.builder()
                .empId(payroll.getEmployee().getEmpId())
                .employeeName(payroll.getEmployee().getEmployeeName())
                .department(payroll.getEmployee().getDepartment() != null ? payroll.getEmployee().getDepartment() : "N/A")
                .payrollMonth(payroll.getPayrollMonth())
                .totalWorkingDays(payroll.getTotalWorkingDays())
                .lossOfPayDays(payroll.getLossOfPayDays())
                .netPaidDays(netPaidDays)
                .grossEarned(payroll.getGrossEarned())
                .professionalTaxDeduction(pt)
                .providentFundDeduction(pf)
                .totalDeductions(payroll.getGrossEarned().subtract(payroll.getNetPayable()))
                .netTakeHomePay(payroll.getNetPayable())
                .paymentStatus(payroll.getPaymentStatus() != null ? payroll.getPaymentStatus().name() : "PENDING")
                .build();
    }

}