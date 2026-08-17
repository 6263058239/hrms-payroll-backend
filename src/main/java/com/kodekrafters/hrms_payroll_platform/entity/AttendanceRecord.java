package com.kodekrafters.hrms_payroll_platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_records", uniqueConstraints = {
        @UniqueConstraint(name = "uk_emp_date", columnNames = {"emp_id", "attendance_date"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee employee;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(name = "total_hours_worked")
    private Double totalHoursWorked;

    @Column(name = "overtime_hours")
    private Double overtimeHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false)
    @Builder.Default
    private AttendanceStatus attendanceStatus = AttendanceStatus.PRESENT;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum AttendanceStatus {
        PRESENT,
        ABSENT,
        HALF_DAY,
        HOLIDAY,
        WEEKEND,
        ON_LEAVE
    }
}