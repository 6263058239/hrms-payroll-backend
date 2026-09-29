package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.entity.EmployeeExit;
import com.kodekrafters.hrms_payroll_platform.service.EmployeeExitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/exits")
@CrossOrigin(origins = "*")
public class EmployeeExitController {
    private final EmployeeExitService employeeExitService;

    public EmployeeExitController(EmployeeExitService employeeExitService)
    {
        this.employeeExitService=employeeExitService;
    }

    // 1. Employee applies for Resignation
    @PostMapping("/apply/{empId}")
    public ResponseEntity<?> applyResignation(@PathVariable Long empId, @RequestBody Map<String, String> payload) {
        try {
            EmployeeExit exit = employeeExitService.applyResignation(empId, payload);
            return ResponseEntity.ok(Map.of(
                    "message", "Resignation application submitted successfully.",
                    "exitId", exit.getId(),
                    "lastWorkingDay", exit.getLastWorkingDay().toString()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 2. Fetch resignation/exit status for an Employee
    @GetMapping("/my-exit/{empId}")
    public ResponseEntity<?> getMyExitDetails(@PathVariable Long empId) {
        EmployeeExit exit = employeeExitService.getExitDetailsByEmpId(empId);
        if (exit == null) {
            return ResponseEntity.ok(Map.of("hasActiveExit", false));
        }
        return ResponseEntity.ok(exit);
    }

    // 3. HR views all pending exits & settlements
    @GetMapping("/all")
    public ResponseEntity<List<EmployeeExit>> getAllExits() {
        return ResponseEntity.ok(employeeExitService.getAllExitRequests());
    }

    // 4. HR updates clearances & F&F settlement calculations
    @PutMapping("/{exitId}/settlement")
    public ResponseEntity<?> updateSettlement(
            @PathVariable Long exitId,
            @RequestBody Map<String, Object> payload) {
        try {
            EmployeeExit updated = employeeExitService.updateClearanceAndSettlement(exitId, payload);
            return ResponseEntity.ok(Map.of(
                    "message", "Full & Final settlement updated successfully.",
                    "finalSettlementAmount", updated.getFinalSettlementAmount()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
