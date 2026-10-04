import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Portal() {
    const navigate = useNavigate();

    // Session State (falls back to a default employee if not logged in for testing)
    const [empId, setEmpId] = useState(() => sessionStorage.getItem('loggedEmpId') || '1019');
    const [empDetails, setEmpDetails] = useState({
        employeeName: sessionStorage.getItem('loggedEmpName') || 'Keshav Meena',
        department: sessionStorage.getItem('loggedEmpDept') || 'IT',
        contactNumber: '',
        currentAddress: '',
        permanentAddress: '',
        idProofFile: null,
        panCardFile: null
    });

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [toast, setToast] = useState(null);

    // Leaves State
    const [leaves, setLeaves] = useState([]);
    const [leaveForm, setLeaveForm] = useState({
        leaveType: 'CASUAL',
        numberOfDays: 1.0,
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        reason: ''
    });

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        contactNumber: '',
        currentAddress: '',
        permanentAddress: ''
    });

    // Helpdesk Grievance State
    const [tickets, setTickets] = useState([]);
    const [ticketForm, setTicketForm] = useState({
        category: 'PAYROLL_SALARY',
        priority: 'MEDIUM',
        subject: '',
        description: ''
    });

    // Exit / Resignation State
    const [exitRecord, setExitRecord] = useState(null);
    const [exitForm, setExitForm] = useState({
        exitType: 'RESIGNATION',
        noticeDays: 30
    });

    // Payslip Modal State
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('August 2026');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Live Clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Load initial employee data
    const loadPortalData = async () => {
        if (!empId) return;

        try {
            const emp = await api.getEmployeeById(empId);
            if (emp) {
                setEmpDetails(emp);
                setProfileForm({
                    contactNumber: emp.contactNumber || '',
                    currentAddress: emp.currentAddress || '',
                    permanentAddress: emp.permanentAddress || ''
                });
            }
        } catch (err) {
            console.error('Error fetching employee profile:', err);
        }

        try {
            const myLeaves = await api.getMyLeaves(empId);
            setLeaves(myLeaves || []);
        } catch (err) {
            console.error('Error fetching leaves:', err);
        }

        try {
            const myTickets = await api.getMyTickets(empId);
            setTickets(myTickets || []);
        } catch (err) {
            console.error('Error fetching tickets:', err);
        }

        try {
            const exit = await api.getMyExit(empId);
            setExitRecord(exit);
        } catch (err) {
            console.error('Error fetching exit status:', err);
        }
    };

    useEffect(() => {
        loadPortalData();
    }, [empId]);

    // Attendance Handlers
    const handleCheckIn = async () => {
        try {
            await api.checkIn(empId);
            showToast('✅ Check-in recorded successfully!');
        } catch (err) {
            showToast('❌ Check-in failed or already recorded for today.', 'error');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.checkOut(empId);
            showToast('✅ Check-out recorded successfully!');
        } catch (err) {
            showToast('❌ Check-out failed. Ensure check-in exists for today.', 'error');
        }
    };

    // Leave Submit Handler
    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        if (!leaveForm.reason.trim()) {
            alert('Please specify a reason for leave.');
            return;
        }

        try {
            await api.applyLeave(empId, leaveForm);
            showToast('✅ Leave request submitted to Manager!');
            setLeaveForm(prev => ({ ...prev, reason: '' }));
            const updatedLeaves = await api.getMyLeaves(empId);
            setLeaves(updatedLeaves || []);
        } catch (err) {
            showToast('❌ Failed to submit leave request.', 'error');
        }
    };

    // Profile Update Handler
    const handleProfileSave = async () => {
        try {
            await api.updateProfile(empId, profileForm);
            showToast('✅ Profile information updated successfully!');
            loadPortalData();
        } catch (err) {
            showToast('❌ Failed to update profile details.', 'error');
        }
    };

    // Document Upload Handler
    const handleFileUpload = async (docType, e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await api.uploadDocument(empId, docType, file);
            showToast(`✅ ${docType} uploaded successfully!`);
            loadPortalData();
        } catch (err) {
            showToast(`❌ Failed to upload ${docType}.`, 'error');
        }
    };

    // Helpdesk Grievance Submit Handler
    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
            alert('Please provide both subject and description.');
            return;
        }

        try {
            const res = await api.raiseTicket(empId, ticketForm);
            showToast(`✅ Ticket #TK-${res.ticketId || ''} submitted to HR Support!`);
            setTicketForm({
                category: 'PAYROLL_SALARY',
                priority: 'MEDIUM',
                subject: '',
                description: ''
            });
            const myTickets = await api.getMyTickets(empId);
            setTickets(myTickets || []);
        } catch (err) {
            showToast('❌ Failed to submit grievance ticket.', 'error');
        }
    };

    // Resignation Submit Handler
    const handleResignationSubmit = async () => {
        if (!window.confirm('Are you sure you want to submit your formal resignation?')) return;

        try {
            const res = await api.applyExit(empId, exitForm);
            showToast(`✅ Resignation submitted! Expected LWD: ${res.lastWorkingDay || '-'}`);
            loadPortalData();
        } catch (err) {
            showToast('❌ Failed to submit resignation.', 'error');
        }
    };

    const handleSignOut = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '6px',
        padding: '9px 12px',
        color: '#f8fafc',
        fontSize: '13px',
        outline: 'none',
        marginTop: '4px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: 600
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
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
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                padding: '16px 24px',
                borderRadius: '12px',
                marginBottom: '20px'
            }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    👤 Employee Self-Service (ESS)
                </h1>
                <button
                    onClick={handleSignOut}
                    style={{
                        background: 'rgba(225, 29, 72, 0.2)',
                        color: '#f43f5e',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        padding: '7px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px'
                    }}
                >
                    🚪 Sign Out
                </button>
            </div>

            {/* User Identity Card */}
            <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                padding: '16px 20px',
                borderRadius: '10px',
                marginBottom: '24px'
            }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Logged In As:</span>
                <h2 style={{ fontSize: '18px', marginTop: '2px', color: '#ffffff' }}>
                    #{empId} - {empDetails.employeeName} ({empDetails.department || 'General'})
                </h2>
            </div>

            {/* Grid: Attendance Punch + Leave Apply */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px', marginBottom: '24px' }}>
                {/* Real-time Punch Card */}
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                        🕒 Real-Time Attendance Punch
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', textAlign: 'center', margin: '10px 0 16px 0' }}>
                        {currentTime}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
                        Recorded against daily office shift. Check-in once daily.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button
                            onClick={handleCheckIn}
                            style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Check In
                        </button>
                        <button
                            onClick={handleCheckOut}
                            style={{ backgroundColor: '#d97706', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Check Out
                        </button>
                    </div>
                </div>

                {/* Apply Leave Card */}
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                        📝 Apply for Leave
                    </div>
                    <form onSubmit={handleLeaveSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={labelStyle}>Leave Type</label>
                                <select
                                    value={leaveForm.leaveType}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="CASUAL">Casual Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="EARNED_ANNUAL">Earned / Annual Leave</option>
                                    <option value="UNPAID_LOP">Unpaid LOP</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Total Days</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={leaveForm.numberOfDays}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, numberOfDays: parseFloat(e.target.value) || 0 })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={labelStyle}>From Date</label>
                                <input
                                    type="date"
                                    value={leaveForm.fromDate}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>To Date</label>
                                <input
                                    type="date"
                                    value={leaveForm.toDate}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Reason</label>
                            <input
                                type="text"
                                placeholder="Specify reason..."
                                value={leaveForm.reason}
                                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '11px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Submit to Manager
                        </button>
                    </form>
                </div>
            </div>

            {/* Payslips Card */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>📄 Monthly Payslips & Tax Breakup</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
                        >
                            <option value="August 2026">August 2026</option>
                            <option value="July 2026">July 2026</option>
                            <option value="June 2026">June 2026</option>
                        </select>
                        <button
                            onClick={() => setShowPayslipModal(true)}
                            style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                        >
                            👁️ View Payslip
                        </button>
                    </div>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                    View itemized earnings, statutory PF/PT/TDS deductions, and download official monthly salary slips.
                </p>
            </div>

            {/* Profile & KYC Documents Card */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                    🛡️ My Profile & KYC Documents
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                    {/* Contact & Addresses */}
                    <div style={{ background: '#0f172a', padding: '18px', borderRadius: '8px', border: '1px solid #334155' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#38bdf8' }}>Personal Contact & Address</h3>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Contact Number</label>
                            <input
                                type="text"
                                value={profileForm.contactNumber}
                                onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Current Address</label>
                            <textarea
                                rows="2"
                                value={profileForm.currentAddress}
                                onChange={(e) => setProfileForm({ ...profileForm, currentAddress: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Permanent Address</label>
                            <textarea
                                rows="2"
                                value={profileForm.permanentAddress}
                                onChange={(e) => setProfileForm({ ...profileForm, permanentAddress: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <button
                            onClick={handleProfileSave}
                            style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', width: '100%' }}
                        >
                            💾 Update Profile Info
                        </button>
                    </div>

                    {/* KYC Document Uploads */}
                    <div style={{ background: '#0f172a', padding: '18px', borderRadius: '8px', border: '1px solid #334155' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#34d399' }}>KYC Verification Documents</h3>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={labelStyle}>Govt. ID Proof (PDF/Image)</span>
                                <span style={{ color: empDetails.idProofFile ? '#34d399' : '#fbbf24', fontSize: '11px', fontWeight: 700 }}>
                                    {empDetails.idProofFile ? '✅ Uploaded' : 'Pending'}
                                </span>
                            </div>
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload('ID_PROOF', e)}
                                style={{ ...inputStyle, padding: '6px' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={labelStyle}>PAN Card Copy (PDF/Image)</span>
                                <span style={{ color: empDetails.panCardFile ? '#34d399' : '#fbbf24', fontSize: '11px', fontWeight: 700 }}>
                                    {empDetails.panCardFile ? '✅ Uploaded' : 'Pending'}
                                </span>
                            </div>
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload('PAN_CARD', e)}
                                style={{ ...inputStyle, padding: '6px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Raise Grievance Card */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                    🎫 Helpdesk & Grievance Support (Raise Issue)
                </div>
                <form onSubmit={handleTicketSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                        <div>
                            <label style={labelStyle}>Issue Category</label>
                            <select
                                value={ticketForm.category}
                                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="PAYROLL_SALARY">Payroll & Salary Discrepancy</option>
                                <option value="ATTENDANCE_LEAVE">Attendance & Leave Correction</option>
                                <option value="KYC_PROFILE">KYC / Profile Verification</option>
                                <option value="GENERAL_QUERY">General Query / Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Priority</label>
                            <select
                                value={ticketForm.priority}
                                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent (Immediate Salary/Tax Impact)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Subject / Brief Summary</label>
                        <input
                            type="text"
                            placeholder="e.g. August salary cut for approved sick leave"
                            value={ticketForm.subject}
                            onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Detailed Description</label>
                        <textarea
                            rows="3"
                            placeholder="Provide complete context, amounts or calculations..."
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{ background: '#8b5cf6', color: '#ffffff', border: 'none', padding: '11px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%' }}
                    >
                        🚀 Submit Ticket to HR Helpdesk
                    </button>
                </form>
            </div>

            {/* My Raised Tickets Table */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
                    📌 My Raised Tickets & HR Status
                </div>
                <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead style={{ backgroundColor: '#020617', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' }}>
                            <tr>
                                <th style={{ padding: '12px 14px' }}>Ticket ID</th>
                                <th style={{ padding: '12px 14px' }}>Category</th>
                                <th style={{ padding: '12px 14px' }}>Subject</th>
                                <th style={{ padding: '12px 14px' }}>Priority</th>
                                <th style={{ padding: '12px 14px' }}>Status</th>
                                <th style={{ padding: '12px 14px' }}>HR Resolution Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '14px' }}>No grievance tickets raised yet.</td></tr>
                            ) : (
                                tickets.map(t => (
                                    <tr key={t.ticketId} style={{ borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 'bold' }}>#TK-{t.ticketId}</td>
                                        <td style={{ padding: '12px 14px', color: '#38bdf8' }}>{t.ticketCategory || t.category || 'GENERAL'}</td>
                                        <td style={{ padding: '12px 14px' }}>{t.subject || '-'}</td>
                                        <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>{t.priority || 'MEDIUM'}</td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{
                                                padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                                                backgroundColor: t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: t.status === 'RESOLVED' ? '#34d399' : '#fbbf24'
                                            }}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 14px', color: t.resolutionRemarks ? '#34d399' : '#94a3b8' }}>
                                            {t.resolutionRemarks || 'Pending HR review...'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Resignation & Separation Section */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
                    🚪 Resignation & Separation Request
                </div>

                {!exitRecord ? (
                    <div>
                        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
                            Initiate formal separation request. Last working day and notice period will be computed automatically.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div>
                                <label style={labelStyle}>Separation Type</label>
                                <select
                                    value={exitForm.exitType}
                                    onChange={(e) => setExitForm({ ...exitForm, exitType: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="RESIGNATION">Formal Resignation</option>
                                    <option value="END_OF_CONTRACT">End of Contract</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Notice Period Required (Days)</label>
                                <input
                                    type="number"
                                    value={exitForm.noticeDays}
                                    onChange={(e) => setExitForm({ ...exitForm, noticeDays: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleResignationSubmit}
                            style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', width: '100%' }}
                        >
                            Submit Resignation Request
                        </button>
                    </div>
                ) : (
                    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '14px' }}>⚠️ Separation In Progress</span>
                            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                NOTICE PERIOD
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', fontSize: '13px' }}>
                            <div>
                                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Exit Type:</span>
                                <strong style={{ color: '#38bdf8' }}>{exitRecord.exitType || 'RESIGNATION'}</strong>
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Resignation Date:</span>
                                <strong style={{ color: '#fff' }}>{exitRecord.resignationDate || '-'}</strong>
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Last Working Day:</span>
                                <strong style={{ color: '#38bdf8' }}>{exitRecord.lastWorkingDay || '-'}</strong>
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Asset Clearance:</span>
                                <strong style={{ color: exitRecord.assetClearanceDone ? '#34d399' : '#fbbf24' }}>
                                    {exitRecord.assetClearanceDone ? '✅ Cleared' : '⏳ Pending'}
                                </strong>
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>No Dues Cleared:</span>
                                <strong style={{ color: exitRecord.noDuesCleared ? '#34d399' : '#fbbf24' }}>
                                    {exitRecord.noDuesCleared ? '✅ Cleared' : '⏳ Pending'}
                                </strong>
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>F&F Settlement:</span>
                                <strong style={{ color: '#34d399', fontSize: '15px' }}>
                                    ₹{Number(exitRecord.finalSettlementAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* My Leaves Table */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
                    📋 My Leave Applications & Approval Status
                </div>
                <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead style={{ backgroundColor: '#020617', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' }}>
                            <tr>
                                <th style={{ padding: '12px 14px' }}>Type</th>
                                <th style={{ padding: '12px 14px' }}>Dates</th>
                                <th style={{ padding: '12px 14px' }}>Days</th>
                                <th style={{ padding: '12px 14px' }}>Reason</th>
                                <th style={{ padding: '12px 14px' }}>Status</th>
                                <th style={{ padding: '12px 14px' }}>Approver Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '14px' }}>No leave applications found.</td></tr>
                            ) : (
                                leaves.map((l, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>{l.leaveType}</td>
                                        <td style={{ padding: '12px 14px' }}>{l.fromDate} to {l.toDate}</td>
                                        <td style={{ padding: '12px 14px' }}>{l.numberOfDays}d</td>
                                        <td style={{ padding: '12px 14px' }}>{l.reason || '-'}</td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{
                                                padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                                                backgroundColor: l.approvalStatus === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : (l.approvalStatus === 'REJECTED' ? 'rgba(225, 29, 72, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                                                color: l.approvalStatus === 'APPROVED' ? '#34d399' : (l.approvalStatus === 'REJECTED' ? '#f43f5e' : '#fbbf24')
                                            }}>
                                                {l.approvalStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{l.approverRemarks || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payslip Modal */}
            {showPayslipModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', width: '100%', maxWidth: '650px', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#ffffff', fontWeight: 700 }}>Salary Statement Preview ({selectedMonth})</span>
                            <button onClick={() => setShowPayslipModal(false)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>✕ Close</button>
                        </div>
                        <div style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '14px' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>KodeKrafters Pvt. Ltd.</h2>
                                <span style={{ fontWeight: 700, color: '#0284c7' }}>MONTHLY PAYSLIP</span>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>
                                Emp ID: <strong>#{empId}</strong> | Name: <strong>{empDetails.employeeName}</strong> | Dept: <strong>{empDetails.department}</strong>
                            </div>
                            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                                <strong>Estimated Net Payable:</strong>
                                <strong style={{ color: '#15803d', fontSize: '17px' }}>₹78,000.00</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}