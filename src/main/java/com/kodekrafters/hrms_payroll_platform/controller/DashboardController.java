package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientLoginRequest;
import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientRegisterRequest;
import com.kodekrafters.hrms_payroll_platform.dto.CorporateClientResponse;
import com.kodekrafters.hrms_payroll_platform.service.CorporateClientService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Controller
public class DashboardController {

    private final CorporateClientService clientService;

    public DashboardController(CorporateClientService clientService) {
        this.clientService = clientService;
    }

    // 1. Show Signup Page
    @GetMapping("/signup")
    public String showSignupPage(Model model) {
        model.addAttribute("registerRequest", new CorporateClientRegisterRequest());
        return "signup";
    }

    // 2. Process Signup
    @PostMapping("/signup")
    public String registerClient(@ModelAttribute("registerRequest") CorporateClientRegisterRequest request, Model model) {
        try {
            clientService.registerClient(request);
            return "redirect:/login";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "signup";
        }
    }

    // 3. Show Login Page
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("loginRequest", new CorporateClientLoginRequest());
        return "login";
    }

    // 4. Process Login (🚨 Added missing @PostMapping)
    @PostMapping("/login")
    public String loginClient(@ModelAttribute("loginRequest") CorporateClientLoginRequest request, HttpSession session, Model model) {
        Optional<CorporateClientResponse> responseOpt = clientService.loginClient(request);
        if (responseOpt.isPresent()) {
            session.setAttribute("loggedInUser", responseOpt.get().getCompanyName());
            return "redirect:/dashboard";
        } else {
            model.addAttribute("error", "Invalid Email or Password");
            return "login";
        }
    }

    // 5. Show Dashboard (🚨 Added missing @GetMapping)
    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) {
        String clientName = (String) session.getAttribute("loggedInUser");
        if (clientName == null) {
            return "redirect:/login";
        }
        model.addAttribute("clientName", clientName);
        return "dashboard";
    }
}