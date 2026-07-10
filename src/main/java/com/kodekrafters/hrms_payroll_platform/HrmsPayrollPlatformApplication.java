package com.kodekrafters.hrms_payroll_platform;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class HrmsPayrollPlatformApplication {
    @PostConstruct
    public void init() {
        // Isse puri application ke liye timezone pehle hi Kolkata set ho jayega
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

	public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));

        SpringApplication.run(HrmsPayrollPlatformApplication.class, args);
	}

}
