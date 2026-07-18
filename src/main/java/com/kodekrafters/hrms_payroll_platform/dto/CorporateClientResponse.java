package com.kodekrafters.hrms_payroll_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorporateClientResponse {
    private Long clientId;
    private String companyName;
    private String country;
    private String billingCurrency;
    private String email;
}
