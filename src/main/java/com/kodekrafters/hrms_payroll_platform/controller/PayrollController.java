package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.PayrollRequestDto;
import com.kodekrafters.hrms_payroll_platform.dto.PayrollResponseDto;
import com.kodekrafters.hrms_payroll_platform.entity.MonthlyPayroll;
import com.kodekrafters.hrms_payroll_platform.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payroll")
public class PayrollController {

}
