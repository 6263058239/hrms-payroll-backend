import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function EmployeeDirectory() {
    const [employees, setEmployees] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('ALL');
    const [loading, setLoading] = useState(true);

    // Toast state
    const [toast, setToast] = useState(null);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        id: null,
        employeeName: '',
        officialEmail: '',
        contactNumber: '',
        department: '',
        designation: '',
        password: ''
    });

    // Leave approvals modal state
    const [leaveModalOpen, setLeaveModalOpen] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [empData, leaveData] = await Promise.all([
                api.getEmployees(),
                api.getPendingLeaves().catch(() => [])
            ]);
            setEmployees(empData || []);
            setPendingLeaves(leaveData || []);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch data from backend', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filter employees
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = 
            (emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (emp.officialEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (emp.empId?.toString().includes(searchTerm));
        const matchesDept = selectedDept === 'ALL' || emp.department?.toUpperCase() === selectedDept.toUpperCase();
        return matchesSearch && matchesDept;
    });

    // Handle Edit Submit
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                employeeName: editForm.employeeName,
                officialEmail: editForm.officialEmail,
                contactNumber: editForm.contactNumber,
                department: editForm.department,
                designation: editForm.designation
            };
            if (editForm.password.trim()) {
                payload.password = editForm.password.trim();
            }

            await api.updateEmployee(editForm.id, payload);
            showToast('Employee details updated successfully!', 'success');
            setEditModalOpen(false);
            loadData();
        } catch (err) {
            showToast('Failed to update employee details.', 'error');
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete employee #${id}?`)) {
            try {
                await api.deleteEmployee(id);
                showToast('Employee deleted successfully!', 'success');
                loadData();
            } catch (err) {
                showToast('Failed to delete employee.', 'error');
            }
        }
    };

    // Handle Leave Action
    const handleLeaveAction = async (leaveId, action) => {
        try {
            const approverEmpId = employees.length > 0 ? employees[0].empId : 1001;
            const remarks = action === 'approve' ? 'Approved by Manager' : 'Rejected';
            await api.updateLeaveStatus(leaveId, action, approverEmpId, remarks);
            showToast(`Leave request successfully ${action}d!`, 'success');
            
            // Refresh pending leaves
            const updatedLeaves = await api.getPendingLeaves();
            setPendingLeaves(updatedLeaves || []);
        } catch (err) {
            showToast('Error processing leave action.', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 9999,
                    backgroundColor: toast.type === 'success' ? '#064e3b' : '#7f1d1d',
                    border: `1px solid ${toast.type === 'success' ? '#059669' : '#dc2626'}`,
                    color: toast.type === 'success' ? '#a7f3d0' : '#fecaca',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            {/* Header */}
            <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>👥 Onboarded Employees Directory</h1>
                        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Live records synced directly from PostgreSQL Database</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: '#0b132b', border: '1px solid #334155', borderRadius: '8px', padding: '14px 18px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Total Headcount</span>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{employees.length}</div>
                    </div>
                    <div style={{ backgroundColor: '#0b132b', border: '1px solid #334155', borderRadius: '8px', padding: '14px 18px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Present Today</span>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>{employees.length}</div>
                    </div>
                    <div 
                        onClick={() => setLeaveModalOpen(true)}
                        style={{ backgroundColor: '#0b132b', border: '1px solid #334155', borderRadius: '8px', padding: '14px 18px', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Pending Leaves</span>
                            <span style={{ fontSize: '10px', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>Click to Review</span>
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>{pendingLeaves.length}</div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search by Name, Email, or EMP ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, minWidth: '250px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', color: '#f8fafc', outline: 'none', fontSize: '14px' }}
                    />
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', color: '#f8fafc', outline: 'none', fontSize: '14px' }}
                    >
                        <option value="ALL">All Departments</option>
                        <option value="IT">IT</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Operations">Operations</option>
                    </select>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ backgroundColor: '#020617', color: '#cbd5e1', fontSize: '12px', textTransform: 'uppercase' }}>
                            <tr>
                                <th style={{ padding: '14px 16px' }}>EMP ID</th>
                                <th style={{ padding: '14px 16px' }}>Full Name</th>
                                <th style={{ padding: '14px 16px' }}>Official Email</th>
                                <th style={{ padding: '14px 16px' }}>Contact Number</th>
                                <th style={{ padding: '14px 16px' }}>Department</th>
                                <th style={{ padding: '14px 16px' }}>Designation</th>
                                <th style={{ padding: '14px 16px' }}>Status</th>
                                <th style={{ padding: '14px 16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Loading employees from database...</td></tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No employees found.</td></tr>
                            ) : (
                                filteredEmployees.map(emp => (
                                    <tr key={emp.empId} style={{ borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '14px 16px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 'bold' }}>#{emp.empId}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#ffffff' }}>{emp.employeeName}</td>
                                        <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{emp.officialEmail}</td>
                                        <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{emp.contactNumber}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ backgroundColor: '#334155', color: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{emp.designation}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                ● Present
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <button
                                                onClick={() => {
                                                    setEditForm({
                                                        id: emp.empId,
                                                        employeeName: emp.employeeName || '',
                                                        officialEmail: emp.officialEmail || '',
                                                        contactNumber: emp.contactNumber || '',
                                                        department: emp.department || '',
                                                        designation: emp.designation || '',
                                                        password: ''
                                                    });
                                                    setEditModalOpen(true);
                                                }}
                                                style={{ backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.empId)}
                                                style={{ backgroundColor: 'rgba(225, 29, 72, 0.2)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Leave Approvals Modal */}
            {leaveModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', width: '95%', maxWidth: '850px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>📋 Manager Leave Approvals</span>
                            <button onClick={() => setLeaveModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ overflowX: 'auto', maxHeight: '350px', marginBottom: '16px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                <thead style={{ backgroundColor: '#020617', color: '#cbd5e1' }}>
                                    <tr>
                                        <th style={{ padding: '10px 14px' }}>Emp ID</th>
                                        <th style={{ padding: '10px 14px' }}>Name</th>
                                        <th style={{ padding: '10px 14px' }}>Type</th>
                                        <th style={{ padding: '10px 14px' }}>Dates</th>
                                        <th style={{ padding: '10px 14px' }}>Days</th>
                                        <th style={{ padding: '10px 14px' }}>Reason</th>
                                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingLeaves.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No pending leave requests! All clear.</td></tr>
                                    ) : (
                                        pendingLeaves.map(req => (
                                            <tr key={req.id} style={{ borderBottom: '1px solid #334155' }}>
                                                <td style={{ padding: '10px 14px', color: '#38bdf8' }}>#{req.employee?.empId || 'N/A'}</td>
                                                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{req.employee?.employeeName || 'Unknown'}</td>
                                                <td style={{ padding: '10px 14px' }}><span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '3px 8px', borderRadius: '4px' }}>{req.leaveType}</span></td>
                                                <td style={{ padding: '10px 14px' }}>{req.fromDate} to {req.toDate}</td>
                                                <td style={{ padding: '10px 14px', fontWeight: 'bold' }}>{req.numberOfDays}d</td>
                                                <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{req.reason || '-'}</td>
                                                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                                                    <button onClick={() => handleLeaveAction(req.id, 'approve')} style={{ backgroundColor: '#059669', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginRight: '6px' }}>Approve</button>
                                                    <button onClick={() => handleLeaveAction(req.id, 'reject')} style={{ backgroundColor: '#e11d48', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Reject</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setLeaveModalOpen(false)} style={{ backgroundColor: '#475569', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Employee Modal */}
            {editModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <form onSubmit={handleSaveEdit} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Edit Employee Details</span>
                            <button type="button" onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                            <input type="text" value={editForm.employeeName} onChange={e => setEditForm({...editForm, employeeName: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Official Email</label>
                            <input type="email" value={editForm.officialEmail} onChange={e => setEditForm({...editForm, officialEmail: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Contact Number</label>
                            <input type="text" value={editForm.contactNumber} onChange={e => setEditForm({...editForm, contactNumber: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                            <input type="text" value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Designation</label>
                            <input type="text" value={editForm.designation} onChange={e => setEditForm({...editForm, designation: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc' }} required />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Reset Password (Optional)</label>
                            <input type="password" placeholder="Leave empty to keep unchanged" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" onClick={() => setEditModalOpen(false)} style={{ backgroundColor: '#475569', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Update Record</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}