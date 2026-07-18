package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientLoginRequest;
import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientRegisterRequest;
import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientResponse;
import com.kodekrafters.hrms_payroll_platform.entity.CorporateClient;
import com.kodekrafters.hrms_payroll_platform.repository.CorporateClientRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CorporateClientServiceImpl implements CorporateClientService{
    private final CorporateClientRepository corporateClientRepository;
    public CorporateClientServiceImpl(CorporateClientRepository corporateClientRepository)
    {
        this.corporateClientRepository=corporateClientRepository;
    }


    @Override
    public CorporateClientResponse registerClient(CorporateClientRegisterRequest request) throws Exception {
        // 1. Check duplicate email
        Optional<CorporateClient> existingClient=corporateClientRepository.findByEmail(request.getEmail());
        if(existingClient.isPresent())
        {
            throw new Exception("Email already registered");
        }
        // 2. Map Request DTO to Entity using Builder pattern
        CorporateClient clientEntity=CorporateClient.builder()
                .companyName(request.getCompanyName())
                .country(request.getCountry())
                .billingCurrency(request.getBillingCurrency())
                .email(request.getEmail())
                .password(request.getPassword()) // In production, use password encoder here
                .build();
        // 3. Save Entity in DB
        CorporateClient savedClient=corporateClientRepository.save(clientEntity);
        // 4. Map Saved Entity back to Secure Response DTO

        return CorporateClientResponse.builder()
                .clientId(savedClient.getClientId())
                .companyName(savedClient.getCompanyName())
                .country(savedClient.getCountry())
                .billingCurrency(savedClient.getBillingCurrency())
                .email(savedClient.getEmail())
                .build();
    }

    @Override
    public Optional<CorporateClientResponse> loginClient(CorporateClientLoginRequest request) {
        // 1. Find user by email and password
        Optional<CorporateClient> clientOpt=corporateClientRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());
        // 2. If present, map to Response DTO, else return empty Optional
        return clientOpt.map(client -> CorporateClientResponse.builder()
                .clientId(client.getClientId())
                .companyName(client.getCompanyName())
                .country(client.getCountry())
                .billingCurrency(client.getBillingCurrency())
                .email(client.getEmail())
                .build());
    }
}
