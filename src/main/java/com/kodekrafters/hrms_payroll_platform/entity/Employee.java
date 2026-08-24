package com.kodekrafters.hrms_payroll_platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "employees")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emp_seq")
    @SequenceGenerator(name = "emp_seq", sequenceName = "emp_sequence", initialValue = 1001, allocationSize = 1)
    @Column(name = "emp_id")
    private Long empId; // Generator nahi hai, manual/imported IDs ke liye

    // ==========================================
    // 1. BASIC & PERSONAL DETAILS
    // ==========================================
    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender; // MALE, FEMALE, OTHER

    @Column(name = "password")
    private String password;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "personal_email")
    private String personalEmail;

    @Column(name = "official_email", unique = true)
    private String officialEmail;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_number")
    private String emergencyContactNumber;

    @Column(name = "current_address", length = 500)
    private String currentAddress;

    @Column(name = "permanent_address", length = 500)
    private String permanentAddress;

    // ==========================================
    // 2. EMPLOYMENT & LIFECYCLE DETAILS
    // ==========================================
    @Column(name = "designation")
    private String designation;

    @Column(name = "department")
    private String department;

    @Column(name = "employment_type")
    private String employmentType; // Full-time, Part-time, Contract, Intern

    @Enumerated(EnumType.STRING)
    @Column(name = "employee_status", nullable = false)
    private EmployeeStatus employeeStatus = EmployeeStatus.ONBOARDING; // Default: ONBOARDING

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @Column(name = "date_of_confirmation")
    private LocalDate dateOfConfirmation; // Probation End Date

    @Column(name = "date_of_left")
    private LocalDate dateOfLeft;

    @Column(name = "reporting_manager_id")
    private Long reportingManagerId;

    @Column(name = "work_location")
    private String workLocation;

    // ==========================================
    // 3. STATUTORY & IDENTITY DETAILS
    // ==========================================
    @Column(name = "uan_number")
    private String uanNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "tax_id_number")
    private String taxIdNumber;

    // ==========================================
    // 4. BANK DETAILS
    // ==========================================
    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "payment_mode")
    private String paymentMode; // Bank Transfer, Cheque, Cash

    // ==========================================
    // 5. AUDIT TIMESTAMPS
    // ==========================================
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ==========================================
    // RELATIONS
    // ==========================================
    @JsonIgnore
    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private SalaryStructure salaryStructure;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeaveRequest> leaveRequests;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttendanceRecord> attendanceRecords;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeaveBalance> leaveBalances;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MonthlyPayroll> monthlyPayrollRecords;


    // ==========================================
    // INNER ENUM FOR LIFECYCLE WORKFLOW
    // ==========================================
    public enum EmployeeStatus {
        ONBOARDING,
        PROBATION,
        ACTIVE,
        NOTICE_PERIOD,
        EXITED
    }
}