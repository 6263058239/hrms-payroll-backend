package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.AttendanceRecord;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRecordService {
    AttendanceRecord checkIn(Long empId);
    AttendanceRecord checkOut(Long empId);
    List<AttendanceRecord> getEmployeeAttendanceHistory(Long empId, LocalDate startDate, LocalDate endDate);
}
