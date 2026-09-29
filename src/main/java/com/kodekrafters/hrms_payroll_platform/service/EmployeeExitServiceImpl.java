package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.entity.EmployeeExit;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeExitRepository;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeExitServiceImpl implements EmployeeExitService{
    private final EmployeeExitRepository employeeExitRepository;
    private final EmployeeRepository employeeRepository;

    public EmployeeExitServiceImpl(EmployeeExitRepository employeeExitRepository, EmployeeRepository employeeRepository)
    {
        this.employeeExitRepository=employeeExitRepository;
        this.employeeRepository=employeeRepository;
    }


    @Override
    public EmployeeExit applyResignation(Long empId, Map<String, String> payload) {
        if (employeeExitRepository.existsByEmployee_EmpId(empId)) {
            throw new RuntimeException("Resignation or exit request already exists for this employee.");
        }

        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + empId));

        int noticeDays = Integer.parseInt(payload.getOrDefault("noticeDays", "30"));
        LocalDate resignDate = LocalDate.now();
        LocalDate lwd = resignDate.plusDays(noticeDays);

        EmployeeExit exit = EmployeeExit.builder()
                .employee(employee)
                .exitType(EmployeeExit.ExitType.valueOf(payload.getOrDefault("exitType", "RESIGNATION")))
                .resignationDate(resignDate)
                .lastWorkingDay(lwd)
                .noticePeriodDaysRequired(noticeDays)
                .noticePeriodDaysServed(0)
                .assetClearanceDone(false)
                .noDuesCleared(false)
                .pendingSalaryAmount(BigDecimal.ZERO)
                .leaveEncashmentAmount(BigDecimal.ZERO)
                .gratuityAmount(BigDecimal.ZERO)
                .noticeShortfallDeduction(BigDecimal.ZERO)
                .finalSettlementAmount(BigDecimal.ZERO)
                .build();

        return employeeExitRepository.save(exit);
    }

    @Override
    public EmployeeExit getExitDetailsByEmpId(Long empId) {
        return employeeExitRepository.findByEmployee_EmpId(empId).orElse(null);
    }

    @Override
    public List<EmployeeExit> getAllExitRequests() {
        return employeeExitRepository.findAll();
    }

    @Override
    public EmployeeExit updateClearanceAndSettlement(Long exitId, Map<String, Object> payload) {
        EmployeeExit exit = employeeExitRepository.findById(exitId)
                .orElseThrow(() -> new RuntimeException("Exit request record not found with ID: " + exitId));

        if (payload.containsKey("assetClearanceDone")) {
            exit.setAssetClearanceDone(Boolean.valueOf(payload.get("assetClearanceDone").toString()));
        }
        if (payload.containsKey("noDuesCleared")) {
            exit.setNoDuesCleared(Boolean.valueOf(payload.get("noDuesCleared").toString()));
        }

        BigDecimal pendingSal = new BigDecimal(payload.getOrDefault("pendingSalaryAmount", "0.00").toString());
        BigDecimal leaveEncash = new BigDecimal(payload.getOrDefault("leaveEncashmentAmount", "0.00").toString());
        BigDecimal gratuity = new BigDecimal(payload.getOrDefault("gratuityAmount", "0.00").toString());
        BigDecimal shortfall = new BigDecimal(payload.getOrDefault("noticeShortfallDeduction", "0.00").toString());

        // Net Calculation: (Pending Sal + Leaves + Gratuity) - Shortfall
        BigDecimal netSettlement = pendingSal.add(leaveEncash).add(gratuity).subtract(shortfall);

        exit.setPendingSalaryAmount(pendingSal);
        exit.setLeaveEncashmentAmount(leaveEncash);
        exit.setGratuityAmount(gratuity);
        exit.setNoticeShortfallDeduction(shortfall);
        exit.setFinalSettlementAmount(netSettlement);

        if (Boolean.TRUE.equals(exit.getAssetClearanceDone()) && Boolean.TRUE.equals(exit.getNoDuesCleared())) {
            exit.setSettlementPaymentDate(LocalDate.now());
        }

        return employeeExitRepository.save(exit);
    }

}
