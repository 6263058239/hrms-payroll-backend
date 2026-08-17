package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.entity.AttendanceRecord;
import com.kodekrafters.hrms_payroll_platform.service.AttendanceRecordService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin(origins = "*")
public class AttendanceRecordController {
    private final AttendanceRecordService attendanceRecordService;
    public AttendanceRecordController(AttendanceRecordService attendanceRecordService)
    {
        this.attendanceRecordService=attendanceRecordService;
    }

    // 1. Employee Check-in Endpoint
    @PostMapping("/check-in/{empId}")
    public ResponseEntity<AttendanceRecord> checkIn(@PathVariable Long empId)
    {
        AttendanceRecord record=attendanceRecordService.checkIn(empId);
        return ResponseEntity.ok(record);
    }


    @PostMapping("/check-out/{empId}")
    public ResponseEntity<AttendanceRecord> checkOut(@PathVariable Long empId)
    {
        AttendanceRecord record=attendanceRecordService.checkOut(empId);
        return ResponseEntity.ok(record);
    }
    // 3. Employee Attendance History By Date Range
    @GetMapping("/history/{empId}")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceHistory(
            @PathVariable Long empId,
            @RequestParam @DateTimeFormat (iso = DateTimeFormat.ISO.DATE)LocalDate startDate,
            @RequestParam @DateTimeFormat (iso = DateTimeFormat.ISO.DATE)LocalDate endDate
            )
    {
      List<AttendanceRecord> history = attendanceRecordService.getEmployeeAttendanceHistory(empId,startDate,endDate);
      return ResponseEntity.ok(history);
    }
}
