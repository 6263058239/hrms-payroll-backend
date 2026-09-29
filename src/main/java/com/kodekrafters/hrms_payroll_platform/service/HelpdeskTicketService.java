package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.HelpdeskTicket;

import java.util.List;
import java.util.Map;

public interface HelpdeskTicketService {
    // 1. Employee creates a grievance/ticket
    HelpdeskTicket raiseTicket(Long empId, Map<String, String> payload);

    // 2. Employee views their own tickets
    List<HelpdeskTicket> getTicketsByEmployeeId(Long empId);


    // 3. HR/Admin views all raised tickets
    List<HelpdeskTicket> getAllTickets();

    // 4. HR updates ticket status with resolution remarks
    HelpdeskTicket updateTicketStatus(Long ticketId, String status, String remarks);
}
