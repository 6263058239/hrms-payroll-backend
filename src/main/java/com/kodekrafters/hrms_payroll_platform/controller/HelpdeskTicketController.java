package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.entity.HelpdeskTicket;
import com.kodekrafters.hrms_payroll_platform.service.HelpdeskTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*")
public class HelpdeskTicketController {
    private final HelpdeskTicketService helpdeskTicketService;

    public HelpdeskTicketController(HelpdeskTicketService helpdeskTicketService)
    {
        this.helpdeskTicketService=helpdeskTicketService;
    }

    // 1. Employee raises a ticket
    @PostMapping("/raise/{empId}")
    public ResponseEntity<?> raiseTicket(@PathVariable Long empId, @RequestBody Map<String, String> payload)
    {
        try{
              HelpdeskTicket created=helpdeskTicketService.raiseTicket(empId, payload);
              return ResponseEntity.ok(Map.of(
                      "message","Ticket raised Successfully!",
                      "ticketId",created.getTicketId()
                      ));
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid category or priority provided."));
        }
        catch (RuntimeException e)
        {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 2. Employee views their ticket history
    @GetMapping("/my-tickets/{empId}")
    public ResponseEntity<List<HelpdeskTicket>> getMyTickets(@PathVariable Long empId)
    {
        return ResponseEntity.ok(helpdeskTicketService.getTicketsByEmployeeId(empId));
    }

    // 3. HR Admin views all tickets across the organization
    @GetMapping("/all")
    public ResponseEntity<List<HelpdeskTicket>> getAllTickets()
    {
        return ResponseEntity.ok(helpdeskTicketService.getAllTickets());
    }

    // 4. HR resolves/rejects a ticket with remarks
    @PutMapping("/{ticketId}/resolve")
    public ResponseEntity<?> resolveTicket(
            @PathVariable Long ticketId,
            @RequestBody Map<String, String> payload){
       try{
            String status=payload.get("status");
            String remarks= payload.get("remarks");

            HelpdeskTicket helpdeskTicket=helpdeskTicketService.updateTicketStatus(ticketId,status,remarks);
           return ResponseEntity.ok(Map.of(
                   "message", "Ticket status updated successfully!",
                   "status", helpdeskTicket.getStatus()
           ));
       }
       catch (IllegalArgumentException e)
       {
           return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value."));
       }
       catch (RuntimeException e)
       {
           return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
       }
    }
}
