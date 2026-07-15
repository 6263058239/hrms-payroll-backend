package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;
import com.kodekrafters.hrms_payroll_platform.entity.SalaryStructure;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import com.kodekrafters.hrms_payroll_platform.repository.MonthlyPayrollRepository;
import com.kodekrafters.hrms_payroll_platform.repository.SalaryStructuredRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
public class PayrollServiceImpl implements PayrollService{
    private final EmployeeRepository employeeRepository;
    private final SalaryStructuredRepository salaryStructuredRepository;
    private final MonthlyPayrollRepository monthlyPayrollRepository;

    public PayrollServiceImpl(EmployeeRepository employeeRepository, SalaryStructuredRepository salaryStructuredRepository, MonthlyPayrollRepository monthlyPayrollRepository)
    {
        this.employeeRepository=employeeRepository;
        this.salaryStructuredRepository=salaryStructuredRepository;
        this.monthlyPayrollRepository=monthlyPayrollRepository;
    }

    @Override
    public MonthlyPayroll generateMonthlyPayroll(Long empId, LocalDate payrollMonth, int totalWorkingDays, int lossOfPayDays) {
        // 1. Database se check karna ki Employee exist karta hai ya nahi
        Employee employee=employeeRepository.findById(empId).orElseThrow(()-> new IllegalArgumentException("Payroll Processing Failed: Employee not found with id:"+empId));
        //2. Double-Payout Shield: Check karna ki same mahine ka payroll pehle se generate toh nahi hai
        monthlyPayrollRepository.findByEmployeeEmpIdAndPayrollMonth(empId, payrollMonth)
                .ifPresent(p->{
                    throw new  IllegalStateException("Process Blocked: Payroll already exists for this employee for month:" +payrollMonth);
                });
        //3. Employee ka master Salary Structure rules fetch karna
        SalaryStructure salaryStructure=salaryStructuredRepository.findByEmployeeEmpId(empId).orElseThrow(()-> new IllegalStateException("Process Blocked: Baseline Salary Structure profile is missing for employee ID: "+empId));
        // 4. Attendance Validation aur Proration Fraction Matrix math
        int netWorkingdays = totalWorkingDays - lossOfPayDays;
        if(netWorkingdays<0)
        {
            throw new IllegalArgumentException("Invalid entry: Loss of Pay days cannot exceed total month days!");
        }
        // Rounding errors/leakage se bachne ke liye 8 decimal points tak precision rakhna
        BigDecimal workingRatio=BigDecimal.valueOf(netWorkingdays)
                .divide(BigDecimal.valueOf(totalWorkingDays), 8, RoundingMode.HALF_UP);
        // 5. Dynamic Earned Salary Elements calculate karna (Prorated Components)
        BigDecimal earnedBasic= salaryStructure.getBasicSalary().multiply(workingRatio);
        BigDecimal earnedDa= salaryStructure.getDa() !=null ? salaryStructure.getDa().multiply(workingRatio) : BigDecimal.ZERO;
        BigDecimal earnedHra= salaryStructure.getHra().multiply(workingRatio);
        BigDecimal earnedSpecial= salaryStructure.getSpecialAllowance() !=null ? salaryStructure.getSpecialAllowance().multiply(workingRatio) : BigDecimal.ZERO;
        // Total Gross Earning add karna
        BigDecimal grossEarned= earnedBasic.add(earnedDa).add(earnedHra).add(earnedSpecial);
        // 6. Indian Statutory Compliances Deductions (PT aur PF) gather karna
        BigDecimal professionalTax= salaryStructure.getProfessionalTax() !=null ? salaryStructure.getProfessionalTax() : BigDecimal.ZERO;
        BigDecimal pfDeduction= salaryStructure.getPfEmployeeDeduction() !=null ? salaryStructure.getPfEmployeeDeduction() : BigDecimal.ZERO;
        BigDecimal totaldeductions= professionalTax.add(pfDeduction);
        // Net take-home amount calculate karna aur safety limit check karna
        BigDecimal netPayable= grossEarned.subtract(totaldeductions);
        if(netPayable.compareTo(BigDecimal.ZERO) < 0){
            netPayable=BigDecimal.ZERO;
        }
        // 7. MonthlyPayroll Object map karke build karna (Strict matching with your entity fields)
        MonthlyPayroll payrollRecord= MonthlyPayroll.builder()
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
        return monthlyPayrollRepository.save(payrollRecord);
    }
}
