package com.kodekrafters.hrms_payroll_platform.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminLoginRequestDto {
    @JsonProperty("username")
    private String username;
    @JsonProperty("password")
    private String password;
}
