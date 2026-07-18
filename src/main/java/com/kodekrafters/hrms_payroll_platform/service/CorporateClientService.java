package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientLoginRequest;
import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientRegisterRequest;
import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientResponse;

import java.util.Optional;

public interface CorporateClientService {
CorporateClientResponse registerClient(CorporateClientRegisterRequest request) throws Exception;
Optional<CorporateClientResponse> loginClient(CorporateClientLoginRequest request);

}
