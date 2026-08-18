package com.kodekrafters.hrms_payroll_platform.controller;

import com.kodekrafters.hrms_payroll_platform.entity.LeaveRequest;
import com.kodekrafters.hrms_payroll_platform.service.LeaveRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
@CrossOrigin(origins = "*")
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService)
    {
        this.leaveRequestService=leaveRequestService;
    }
    // 1. Employee Apply Leave Endpoint
    @PostMapping("/apply/{empId}")
    public ResponseEntity<LeaveRequest> applyLeave(
            @PathVariable Long empId,
            @RequestBody LeaveRequest request){
      LeaveRequest appliedLeave=leaveRequestService.applyLeave(request,empId);
      return ResponseEntity.ok(appliedLeave);
    }

    // 2. Manager/HR Approve Leave Endpoint
    @PostMapping("/{leaveRequestId}/approve")
    public ResponseEntity<LeaveRequest> approveLeave(
            @PathVariable Long leaveRequestId,
            @RequestParam Long approverEmpId,
            @RequestParam(required = false, defaultValue = "Approved") String remarks
    )
    {
       LeaveRequest approved=leaveRequestService.approveLeave(leaveRequestId,approverEmpId,remarks);
       return ResponseEntity.ok(approved);
    }

    // 3. Manager/HR Reject Leave Endpoint
    @PostMapping("/{leaveRequestId}/reject")
    public ResponseEntity<LeaveRequest> rejectLeave(
            @PathVariable Long leaveRequestId,
            @RequestParam Long approverEmpId,
            @RequestParam(required = false, defaultValue = "Rejected") String remarks
    ){
     LeaveRequest reject=leaveRequestService.rejectLeave(leaveRequestId,approverEmpId,remarks);
     return ResponseEntity.ok(reject);
    }

    // 4. Get All Leaves of a Specific Employee
    @GetMapping("/employee/{empId}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(@PathVariable Long empId)
    {
     List<LeaveRequest> leaves=leaveRequestService.getEmployeeLeaves(empId);
     return ResponseEntity.ok(leaves);
    }

    // 5. Get All Pending Leaves for Admin/HR Dashboard
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves(){
        List<LeaveRequest> pendingLeaves=leaveRequestService.getPendingLeaves();
        return ResponseEntity.ok(pendingLeaves);
    }


}
