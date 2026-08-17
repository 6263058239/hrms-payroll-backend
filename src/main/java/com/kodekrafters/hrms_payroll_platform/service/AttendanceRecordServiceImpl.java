package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.AttendanceRecord;
import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.repository.AttendanceRecordRepository;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceRecordServiceImpl implements AttendanceRecordService{
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final EmployeeRepository employeeRepository;
    public AttendanceRecordServiceImpl(AttendanceRecordRepository attendanceRecordRepository, EmployeeRepository employeeRepository)
    {
        this.attendanceRecordRepository=attendanceRecordRepository;
        this.employeeRepository=employeeRepository;
    }

    @Override
    @Transactional
    public AttendanceRecord checkIn(Long empId) {
        LocalDate today=LocalDate.now();//Server ki current date (e.g., 2026-08-14) nikalta hai.
        LocalTime now=LocalTime.now();//Server ka exact current time (e.g., 19:56:00) nikalta hai.

        AttendanceRecord record=attendanceRecordRepository.findByEmployee_EmpIdAndAttendanceDate(empId, today)
                .orElseGet(()->{//Case 1 (Agar row mili): To seedha wahi existing record utha lega.
                   //Case 2 (Agar row nahi mili): Lambda function ke andar jayega aur naya record create karega.
                    Employee emp=employeeRepository.findById(empId)
                            .orElseThrow(()-> new RuntimeException("Employee not found with With ID:"+empId));
                    return AttendanceRecord.builder()
                            .employee(emp)
                            .attendanceDate(today)
                            .attendanceStatus(AttendanceRecord.AttendanceStatus.PRESENT)
                            .build();
                });
        if (record.getCheckInTime() == null){
            //if (record.getCheckInTime() == null): Check karta hai ki employee ka pehle se check-in time dala hua hai ya nahi. Agar banda din me 2 baar check-in button dabaye, toh uska pehla check-in time overwrite nahi hona chahiye!
            record.setCheckInTime(now);
         //record.setCheckInTime(now);: Agar pehli baar aya hai, toh current time ko checkInTime me set kar diya.

        }
        return attendanceRecordRepository.save(record);
    }

    @Override
    @Transactional
    public AttendanceRecord checkOut(Long empId) {
        LocalDate today=LocalDate.now();
        LocalTime now=LocalTime.now();
        //Date aur current time capture kiya.
        AttendanceRecord record=attendanceRecordRepository.findByEmployee_EmpIdAndAttendanceDate(empId, today)
                .orElseThrow(()-> new RuntimeException("Check -in record not found for today. Please check in first."));

        record.setCheckOutTime(now);

        if (record.getCheckInTime()!= null)
        {
            long minutes= Duration.between(record.getCheckInTime(), now).toMinutes();
            double hours = minutes / 60.0;
            record.setTotalHoursWorked(Math.round(hours * 100.0) / 100.0);
            // Overtime logic (> 8 hours standard shift)
            if (hours > 8.0)
            {
                record.setOvertimeHours(Math.round((hours - 8.0) * 100.0) / 100.0);
            }
            else {
                record.setOvertimeHours(0.0);
            }
        }
        return attendanceRecordRepository.save(record);
    }

    @Override
    public List<AttendanceRecord> getEmployeeAttendanceHistory(Long empId, LocalDate startDate, LocalDate endDate) {
        return attendanceRecordRepository.findByEmployee_EmpIdAndAttendanceDateBetween(empId, startDate, endDate);
    }
}
