package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.PayrollSummaryDTO;
import com.kodekrafters.hrms_payroll_platform.service.SalaryStructureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class PayrollMetricsController {
    private final SalaryStructureService salaryStructureService;

    public PayrollMetricsController(SalaryStructureService salaryStructureService)
    {
        this.salaryStructureService=salaryStructureService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<PayrollSummaryDTO> getDashboardMetrics()
    {
        PayrollSummaryDTO metrics =salaryStructureService.getDashboardMetrics();
        return ResponseEntity.ok(metrics);
    }
}
