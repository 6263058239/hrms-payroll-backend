package com.kodekrafters.hrms_payroll_platform.service;

import com.kodekrafters.hrms_payroll_platform.entity.Employee;
import com.kodekrafters.hrms_payroll_platform.entity.HelpdeskTicket;
import com.kodekrafters.hrms_payroll_platform.repository.EmployeeRepository;
import com.kodekrafters.hrms_payroll_platform.repository.HelpdeskTicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class HelpdeskTicketServiceImpl implements HelpdeskTicketService{
    private final HelpdeskTicketRepository helpdeskTicketRepository;
    private final EmployeeRepository employeeRepository;

    public HelpdeskTicketServiceImpl(HelpdeskTicketRepository helpdeskTicketRepository, EmployeeRepository employeeRepository)
    {
        this.helpdeskTicketRepository=helpdeskTicketRepository;
        this.employeeRepository=employeeRepository;
    }

    @Override
    public HelpdeskTicket raiseTicket(Long empId, Map<String, String> payload) {
        Employee employee=employeeRepository.findById(empId)
                .orElseThrow(()-> new RuntimeException("employee not found with this id:"+empId));
        HelpdeskTicket ticket= new HelpdeskTicket();
        ticket.setEmployee(employee);
        // Enum conversions
        String categoryStr= payload.getOrDefault("category","GENERAL_QUERY");
        ticket.setTicketCategory(HelpdeskTicket.TicketCategory.valueOf(categoryStr));

        String priorityStr = payload.getOrDefault("priority", "MEDIUM");
        ticket.setPriority(HelpdeskTicket.TicketPriority.valueOf(priorityStr));

        ticket.setSubject(payload.get("subject"));
        ticket.setDescription(payload.get("description"));
        ticket.setStatus(HelpdeskTicket.TicketStatus.OPEN);

        return helpdeskTicketRepository.save(ticket);

    }

    @Override
    public List<HelpdeskTicket> getTicketsByEmployeeId(Long empId) {
        // Database se sab fetch karke Java se filter karega, koi JPA query issue nahi aayega
        return helpdeskTicketRepository.findAll().stream()
                .filter(t -> t.getEmployee() != null && t.getEmployee().getEmpId().equals(empId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    @Override
    public List<HelpdeskTicket> getAllTickets() {
        return helpdeskTicketRepository.findAll();
    }

    @Override
    public HelpdeskTicket updateTicketStatus(Long ticketId, String status, String remarks) {
         HelpdeskTicket helpdeskTicket=helpdeskTicketRepository.findById(ticketId)
                 .orElseThrow(()-> new RuntimeException("Ticket not found with this ID:"+ticketId));

         HelpdeskTicket.TicketStatus newStatus=HelpdeskTicket.TicketStatus.valueOf(status);
         helpdeskTicket.setStatus(newStatus);
         helpdeskTicket.setResolutionRemarks(remarks);

         if (newStatus == HelpdeskTicket.TicketStatus.RESOLVED || newStatus == HelpdeskTicket.TicketStatus.CLOSED)
         {
             helpdeskTicket.setResolvedAt(LocalDateTime.now());
         }

         return helpdeskTicketRepository.save(helpdeskTicket);
    }
}
