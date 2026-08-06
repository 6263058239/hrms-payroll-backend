package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.AdminLoginRequestDto;
import com.kodekrafters.hrms_payroll_platform.entity.UserRole;
import com.kodekrafters.hrms_payroll_platform.repository.UserRoleRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService{
    private final UserRoleRepository userRoleRepository;

    public AdminServiceImpl(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public Map<String, Object> authenticateAdmin(AdminLoginRequestDto loginDto) {
        Map<String, Object> response = new HashMap<>();

        if (loginDto == null || loginDto.getUsername() == null || loginDto.getPassword() == null) {
            response.put("status", "ERROR");
            response.put("message", "Username or Password cannot be empty");
            return response;
        }

        Optional<UserRole> userRoleOpt = userRoleRepository.findByUsername(loginDto.getUsername().trim());

        if (userRoleOpt.isPresent()) {
            UserRole userRole = userRoleOpt.get();

            // Compare passwords
            if (userRole.getPasswordHash() != null && userRole.getPasswordHash().trim().equals(loginDto.getPassword().trim())) {

                String roleStr = userRole.getRoleType() != null ? userRole.getRoleType().name() : "";

                if ("ADMIN".equalsIgnoreCase(roleStr) || "HR".equalsIgnoreCase(roleStr)) {
                    response.put("status", "SUCCESS");
                    response.put("message", "Admin Login Successful");
                    response.put("username", userRole.getUsername());
                    response.put("role", roleStr);
                    return response;
                } else {
                    response.put("status", "FORBIDDEN");
                    response.put("message", "Access Denied: You do not have Admin privileges");
                    return response;
                }
            }
        }

        response.put("status", "ERROR");
        response.put("message", "Invalid Username or Password");
        return response;
    }
}
