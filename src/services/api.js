const BASE_URL = "http://localhost:8080/api/v1";

export const api = {
    // 1. Employees & Directory
    getEmployees: async () => {
        const res = await fetch(`${BASE_URL}/employees`);
        if (!res.ok) throw new Error("Failed to fetch employees");
        return res.json();
    },
    getEmployeeById: async (id) => {
        const res = await fetch(`${BASE_URL}/employees/${id}`);
        if (!res.ok) throw new Error("Failed to fetch employee details");
        return res.json();
    },
    deleteEmployee: async (id) => {
        const res = await fetch(`${BASE_URL}/employees/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete employee");
        return res;
    },
    updateEmployee: async (id, data) => {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update employee");
        return res.json();
    },
    onboardEmployee: async (employeeData) => {
        const res = await fetch(`${BASE_URL}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        });
        if (!res.ok) throw new Error("Failed to onboard employee");
        return res.json();
    },
    updateProfile: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/employees/${id}/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
    },
    uploadDocument: async (id, docType, file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);
        const res = await fetch(`${BASE_URL}/employees/${id}/upload-document`, {
            method: "POST",
            body: formData
        });
        if (!res.ok) throw new Error("Failed to upload document");
        return res;
    },

    // 2. Dashboard Metrics
    getDashboardMetrics: async () => {
        try {
            const res = await fetch(`${BASE_URL}/dashboard/metrics`);
            if (!res.ok) return null;
            return res.json();
        } catch (e) {
            return null;
        }
    },

    // 3. Salary Structures & Payroll
    getSalaryStructures: async () => {
        const res = await fetch(`${BASE_URL}/salary-structures`);
        if (!res.ok) throw new Error("Failed to fetch salary structures");
        return res.json();
    },
    createSalaryStructure: async (salaryData) => {
        const res = await fetch(`${BASE_URL}/salary-structures`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(salaryData)
        });
        if (!res.ok) throw new Error("Failed to create salary structure");
        return res.json();
    },
    updateSalaryStructure: async (id, data) => {
        const res = await fetch(`${BASE_URL}/salary-structures/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update salary");
        return res.json();
    },
    deleteSalaryStructure: async (id) => {
        const res = await fetch(`${BASE_URL}/salary-structures/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete salary");
        return res;
    },

    // 4. Attendance
    checkIn: async (empId) => {
        const res = await fetch(`${BASE_URL}/attendance/check-in/${empId}`, { method: "POST" });
        if (!res.ok) throw new Error("Check-in failed or already recorded");
        return res;
    },
    checkOut: async (empId) => {
        const res = await fetch(`${BASE_URL}/attendance/check-out/${empId}`, { method: "POST" });
        if (!res.ok) throw new Error("Check-out failed. Ensure check-in exists");
        return res;
    },

    // 5. Leaves (Admin Directory & ESS)
    getPendingLeaves: async () => {
        try {
            const res = await fetch(`${BASE_URL}/leaves/pending`);
            if (!res.ok) return [];
            return res.json();
        } catch (e) {
            return [];
        }
    },
    updateLeaveStatus: async (leaveId, action, approverEmpId = 1001, remarks = "") => {
        const res = await fetch(
            `${BASE_URL}/leaves/${leaveId}/${action}?approverEmpId=${approverEmpId}&remarks=${encodeURIComponent(remarks)}`,
            { method: "POST" }
        );
        if (!res.ok) throw new Error(`Failed to ${action} leave`);
        return res;
    },
    applyLeave: async (empId, payload) => {
        const res = await fetch(`${BASE_URL}/leaves/apply/${empId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Leave application failed");
        return res.json();
    },
    getMyLeaves: async (empId) => {
        const res = await fetch(`${BASE_URL}/leaves/employee/${empId}`);
        if (!res.ok) return [];
        return res.json();
    },

    // 6. Helpdesk Tickets
    getAllTickets: async () => {
        const res = await fetch(`${BASE_URL}/tickets/all`);
        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
    },
    getMyTickets: async (empId) => {
        const res = await fetch(`${BASE_URL}/tickets/my-tickets/${empId}`);
        if (!res.ok) return [];
        return res.json();
    },
    raiseTicket: async (empId, payload) => {
        const res = await fetch(`${BASE_URL}/tickets/raise/${empId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to raise ticket");
        return res.json();
    },
    resolveTicket: async (ticketId, payload) => {
        const res = await fetch(`${BASE_URL}/tickets/${ticketId}/resolve`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to resolve ticket");
        return res.json();
    },

    // 7. Offboarding & Exits
    getAllExits: async () => {
        const res = await fetch(`${BASE_URL}/exits/all`);
        if (!res.ok) throw new Error("Failed to fetch exits");
        return res.json();
    },
    getMyExit: async (empId) => {
        const res = await fetch(`${BASE_URL}/exits/my-exit/${empId}`);
        if (!res.ok) return null;
        return res.json();
    },
    applyExit: async (empId, payload) => {
        const res = await fetch(`${BASE_URL}/exits/apply/${empId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to submit exit request");
        return res.json();
    },
    updateSettlement: async (exitId, payload) => {
        const res = await fetch(`${BASE_URL}/exits/${exitId}/settlement`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to update settlement");
        return res.json();
    }
};