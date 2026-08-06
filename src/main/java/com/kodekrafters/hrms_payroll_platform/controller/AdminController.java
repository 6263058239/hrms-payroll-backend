package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.AdminLoginRequestDto;
import com.kodekrafters.hrms_payroll_platform.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService)
    {
        this.adminService=adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminLoginRequestDto loginDto) {
        Map<String, Object> result = adminService.authenticateAdmin(loginDto);

        if ("SUCCESS".equals(result.get("status"))) {
            return ResponseEntity.ok(result);
        } else if ("FORBIDDEN".equals(result.get("status"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

}
