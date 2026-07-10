package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data// Lombok automatically getters, setters, aur toString bana dega
public class Employee {
    @Id
    @Column(name = "emp_id")
    private Long empId; // Generator nahi lagaya hai kyunki ID sir ki sheet se aayegi (e.g., 1001, 1005)

    @Column(name = "employee_name",nullable = false)
    private String employeeName;

    @Column(name = "designation")
    private String designation;

    @Column(name = "department")
    private String department;

    @Column(name = "date_of_joining")
    private LocalDateTime dateOfJoining;

    @Column(name = "date_of_left")
    private LocalDateTime dateOfLeft;

    @Column(name = "uan_number")
    private String uanNumber;


}
