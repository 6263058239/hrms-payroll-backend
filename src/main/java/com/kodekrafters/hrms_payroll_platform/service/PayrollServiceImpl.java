package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;
import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import com.kodekrafters.hrms_payroll_platform.repository.MonthlyPayrollRepository;
import com.kodekrafters.hrms_payroll_platform.repository.SalaryStructureRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PayrollServiceImpl implements PayrollService {

    private final EmployeeRepository employeeRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final MonthlyPayrollRepository monthlyPayrollRepository;

    public PayrollServiceImpl(EmployeeRepository employeeRepository,
                              SalaryStructureRepository salaryStructureRepository,
                              MonthlyPayrollRepository monthlyPayrollRepository) {
        this.employeeRepository = employeeRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.monthlyPayrollRepository = monthlyPayrollRepository;
    }

    @Override
    public MonthlyPayroll generateMonthlyPayroll(Long empId, LocalDate payrollMonth, Integer totalWorkingDays, Integer lossOfPayDays) {
        // 1. Employee existence validation
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("Payroll Processing Failed: Employee not found with id: " + empId));

        // 2. Double-Payout Shield
        monthlyPayrollRepository.findByEmployeeEmpIdAndPayrollMonth(empId, payrollMonth)
                .ifPresent(p -> {
                    throw new IllegalStateException("Process Blocked: Payroll already exists for this employee for month: " + payrollMonth);
                });

        // 3. Baseline Salary Structure fetch
        SalaryStructure salaryStructure = salaryStructureRepository.findByEmployeeEmpId(empId)
                .orElseThrow(() -> new IllegalStateException("Process Blocked: Baseline Salary Structure profile is missing for employee ID: " + empId));

        // 4. Attendance Validation & Working Ratio calculation
        int netWorkingdays = totalWorkingDays - lossOfPayDays;
        if (netWorkingdays < 0) {
            throw new IllegalArgumentException("Invalid entry: Loss of Pay days cannot exceed total month days!");
        }

        BigDecimal workingRatio = BigDecimal.valueOf(netWorkingdays)
                .divide(BigDecimal.valueOf(totalWorkingDays), 8, RoundingMode.HALF_UP);

        // 5. Dynamic Prorated Earnings
        BigDecimal earnedBasic = salaryStructure.getBasicSalary().multiply(workingRatio);
        BigDecimal earnedDa = salaryStructure.getDa() != null ? salaryStructure.getDa().multiply(workingRatio) : BigDecimal.ZERO;
        BigDecimal earnedHra = salaryStructure.getHra() != null ? salaryStructure.getHra().multiply(workingRatio) : BigDecimal.ZERO;
        BigDecimal earnedSpecial = salaryStructure.getSpecialAllowance() != null ? salaryStructure.getSpecialAllowance().multiply(workingRatio) : BigDecimal.ZERO;

        BigDecimal grossEarned = earnedBasic.add(earnedDa).add(earnedHra).add(earnedSpecial);

        // 6. Statutory Compliances Deductions (PT + PF)
        BigDecimal professionalTax = salaryStructure.getProfessionalTax() != null ? salaryStructure.getProfessionalTax() : BigDecimal.ZERO;
        BigDecimal pfDeduction = salaryStructure.getPfEmployeeContribution() != null ? salaryStructure.getPfEmployeeContribution() : BigDecimal.ZERO;
        BigDecimal totalDeductions = professionalTax.add(pfDeduction);

        // Net take-home calculation
        BigDecimal netPayable = grossEarned.subtract(totalDeductions);
        if (netPayable.compareTo(BigDecimal.ZERO) < 0) {
            netPayable = BigDecimal.ZERO;
        }

        // 7. Map strictly to your MonthlyPayroll entity fields
        return MonthlyPayroll.builder()
                .employee(employee)
                .payrollMonth(payrollMonth)
                .totalWorkingDays(totalWorkingDays)
                .lossOfPayDays(lossOfPayDays)
                .grossEarned(grossEarned.setScale(2, RoundingMode.HALF_UP))
                .tdsDeduction(BigDecimal.ZERO)
                .advanceDeduction(BigDecimal.ZERO)
                .netPayable(netPayable.setScale(2, RoundingMode.HALF_UP))
                .actualPaid(netPayable.setScale(2, RoundingMode.HALF_UP))
                .paymentStatus(MonthlyPayroll.PaymentStatus.PENDING)
                .build();
    }

    @Override
    @Transactional
    public MonthlyPayroll saveMonthlyPayroll(Long empId, LocalDate payrollMonth, Integer totalWorkingDays, Integer lossOfPayDays) {
        Optional<MonthlyPayroll> existingPayroll = monthlyPayrollRepository.findByEmployeeEmpIdAndPayrollMonth(empId, payrollMonth);
        if (existingPayroll.isPresent()) {
            throw new IllegalStateException("Payroll already generated and finalized for Employee ID: " + empId + " for month: " + payrollMonth);
        }

        MonthlyPayroll payrollToSave = generateMonthlyPayroll(empId, payrollMonth, totalWorkingDays, lossOfPayDays);
        return monthlyPayrollRepository.save(payrollToSave);
    }

    @Override
    public List<MonthlyPayroll> getPayrollHistoryByEmployee(Long empId) {
        return monthlyPayrollRepository.findByEmployeeEmpIdOrderByPayrollMonthDesc(empId);
    }

    @Override
    @Transactional
    public MonthlyPayroll updatePaymentStatus(Long payrollId, MonthlyPayroll.PaymentStatus status) {
        MonthlyPayroll payroll = monthlyPayrollRepository.findById(payrollId)
                .orElseThrow(() -> new IllegalArgumentException("Payroll record not found with ID: " + payrollId));

        payroll.setPaymentStatus(status);
        return monthlyPayrollRepository.save(payroll);
    }
}