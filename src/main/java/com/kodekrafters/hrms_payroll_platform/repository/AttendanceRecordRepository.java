package com.kodekrafters.hrms_payroll_platform.repository;

import com.kodekrafters.hrms_payroll_platform.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord,Long> {

    // Specific month/date range ke liye attendance fetch karne ke liye (Payroll Engine use karega)
    List<AttendanceRecord> findByEmployee_EmpIdAndAttendanceDateBetween(Long empId, LocalDate startDate, LocalDate endDate);

    // Dynamic LOP/Absent days count karne ke liye
    long countByEmployee_EmpIdAndAttendanceDateBetweenAndAttendanceStatus(
            Long empId, LocalDate startDate, LocalDate endDate, AttendanceRecord.AttendanceStatus status);

    Optional<AttendanceRecord> findByEmployee_EmpIdAndAttendanceDate(Long empId, LocalDate attendanceDate);
}
