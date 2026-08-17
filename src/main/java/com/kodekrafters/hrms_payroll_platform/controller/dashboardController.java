package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.dto.*;
import com.kodekrafters.hrms_payroll_platform.service.CorporateClientService;
import com.kodekrafters.hrms_payroll_platform.service.SalaryStructureService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Controller
public class dashboardController {
    private final CorporateClientService clientService;
    private final SalaryStructureService salaryStructureService;

    // In-memory list for demo presentation
    private final List<Map<String, String>> customerList = new ArrayList<>();
    private final List<Map<String, String>> itemList = new ArrayList<>();

    public dashboardController(CorporateClientService clientService, SalaryStructureService salaryStructureService) {
        this.clientService = clientService;
        this.salaryStructureService=salaryStructureService;
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

    // 4. Process Login
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

    // 5. Show Dashboard
    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) {
        String clientName = (String) session.getAttribute("loggedInUser");
        if (clientName == null) {
            return "redirect:/login";
        }
        model.addAttribute("clientName", clientName);
        return "dashboard";
    }

    // 6. Show Customers List Page
    @GetMapping("/customers")
    public String showCustomersPage(Model model) {
        model.addAttribute("customers", customerList);
        return "customers";
    }

    // 7. Show New Customer Creation Page
    @GetMapping("/customers/new")
    public String showAddCustomerPage() {
        return "add-customer";
    }

    // 8. Process Add New Customer
    @PostMapping("/customers/new")
    public String handleAddCustomer(@RequestParam("name") String name,
                                    @RequestParam("company") String company,
                                    @RequestParam("email") String email,
                                    @RequestParam("phone") String phone) {
        Map<String, String> cust = new HashMap<>();
        cust.put("name", name);
        cust.put("company", company);
        cust.put("email", email);
        cust.put("phone", phone);

        // Add to top of list
        customerList.add(0, cust);
        return "redirect:/customers";
    }

    // 9. Items Page Mapping
    @GetMapping("/items")
    public String showItemsPage(Model model) {
        model.addAttribute("items", itemList);
        return "items";
    }

    // 10. Add New Item Page Mapping
    @GetMapping("/items/new")
    public String showAddItemPage() {
        return "add-items";
    }

    // 11. Process Add New Item
    @PostMapping("/items/new")
    public String handleAddItem(@RequestParam("name") String name,
                                @RequestParam("rate") String rate,
                                @RequestParam("unit") String unit) {
        Map<String, String> item = new HashMap<>();
        item.put("name", name);
        item.put("rate", rate);
        item.put("unit", unit);

        // Add to top of list
        itemList.add(0, item);
        return "redirect:/items";
    }

}