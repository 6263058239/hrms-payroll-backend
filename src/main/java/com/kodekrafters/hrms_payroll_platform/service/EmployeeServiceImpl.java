package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.EmployeeDto;
import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.repository.AttendanceRecordRepository;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import com.kodekrafters.hrms_payroll_platform.repository.LeaveRequestRepository;
import com.kodekrafters.hrms_payroll_platform.repository.MonthlyPayrollRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeServiceImpl implements EmployeeService{
    private final String UPLOAD_DIR = "uploads/documents/";
    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Not Found With This ID:" + id));
    }

    @Override
    public Employee updateEmployee(Long id, EmployeeDto dto) {
        return employeeRepository.findById(id).map(emp -> {
            if (dto.getEmployeeName() != null) emp.setEmployeeName(dto.getEmployeeName());
            if (dto.getOfficialEmail() != null) emp.setOfficialEmail(dto.getOfficialEmail());
            if (dto.getContactNumber() != null) emp.setContactNumber(dto.getContactNumber());
            if (dto.getDepartment() != null) emp.setDepartment(dto.getDepartment());
            if (dto.getDesignation() != null) emp.setDesignation(dto.getDesignation());
            return employeeRepository.save(emp);
        }).orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    // ⚡ 1. Profile Contact & Addresses Update Implementation
    @Override
    public Employee updateProfile(Long id, Map<String, String> payload) {
        Employee emp = getEmployeeById(id);

        if (payload.containsKey("contactNumber")) {
            emp.setContactNumber(payload.get("contactNumber"));
        }
        if (payload.containsKey("currentAddress")) {
            emp.setCurrentAddress(payload.get("currentAddress"));
        }
        if (payload.containsKey("permanentAddress")) {
            emp.setPermanentAddress(payload.get("permanentAddress"));
        }

        return employeeRepository.save(emp);
    }

    // ⚡ 2. Multipart Document Upload Implementation
    @Override
    public String uploadDocument(Long id, String docType, MultipartFile file) throws IOException {
        Employee emp = getEmployeeById(id);

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filename = "emp_" + id + "_" + docType + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        if ("ID_PROOF".equalsIgnoreCase(docType)) {
            emp.setIdProofFile(filename);
        } else if ("PAN_CARD".equalsIgnoreCase(docType)) {
            emp.setPanCardFile(filename);
        }

        employeeRepository.save(emp);
        return filename;
    }
}
