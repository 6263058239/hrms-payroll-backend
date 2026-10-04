import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Helpdesk() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);

    // Modal State
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalStatus, setModalStatus] = useState('RESOLVED');
    const [modalRemarks, setModalRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await api.getAllTickets();
            setTickets(data || []);
        } catch (err) {
            console.error(err);
            showToast('Failed to load tickets. Backend might be offline.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    // Stats Counters
    const totalRaised = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    // Filter Logic
    const filteredTickets = tickets.filter(t => {
        const matchesStatus = (statusFilter === 'ALL') || (t.status === statusFilter);
        const empName = t.employee ? (t.employee.employeeName || '') : '';
        const empId = t.employee ? String(t.employee.empId) : '';
        const sub = t.subject || '';
        const query = searchQuery.toLowerCase();

        const matchesSearch = empName.toLowerCase().includes(query) ||
                              empId.includes(query) ||
                              sub.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    const openActionModal = (ticket) => {
        setSelectedTicket(ticket);
        setModalStatus(ticket.status === 'OPEN' ? 'RESOLVED' : ticket.status);
        setModalRemarks(ticket.resolutionRemarks || '');
    };

    const closeActionModal = () => {
        setSelectedTicket(null);
        setModalRemarks('');
    };

    const handleSaveResolution = async () => {
        if (!modalRemarks.trim()) {
            alert('Please provide resolution remarks or action details.');
            return;
        }

        setSubmitting(true);
        try {
            await api.resolveTicket(selectedTicket.ticketId, {
                status: modalStatus,
                remarks: modalRemarks.trim()
            });
            showToast(`Ticket #TK-${selectedTicket.ticketId} updated to ${modalStatus}!`, 'success');
            closeActionModal();
            loadTickets();
        } catch (err) {
            console.error(err);
            showToast('Failed to update ticket status.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'OPEN':
                return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
            case 'IN_PROGRESS':
                return { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' };
            case 'RESOLVED':
                return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };
            case 'CLOSED':
                return { backgroundColor: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' };
            default:
                return { backgroundColor: '#334155', color: '#cbd5e1' };
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return '#f43f5e';
            case 'HIGH': return '#fb923c';
            case 'MEDIUM': return '#fbbf24';
            default: return '#94a3b8';
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            {/* Header Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                padding: '16px 24px',
                borderRadius: '12px',
                marginBottom: '24px'
            }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🎫 HR Central Helpdesk & Grievance Console
                </h1>
                <button
                    onClick={loadTickets}
                    style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px'
                    }}
                >
                    🔄 Refresh Queue
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Raised</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>{totalRaised}</h3>
                </div>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Open (Action Needed)</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#fbbf24' }}>{openTickets}</h3>
                </div>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#38bdf8' }}>{inProgressTickets}</h3>
                </div>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Resolved / Closed</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#34d399' }}>{resolvedTickets}</h3>
                </div>
            </div>

            {/* Toolbar Filter / Search */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                padding: '16px 20px',
                borderRadius: '10px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '13px', color: '#94a3b8' }}>Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">OPEN Only</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Employee or Subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 14px', color: '#f8fafc', fontSize: '13px', outline: 'none', width: '280px' }}
                    />
                </div>
            </div>

            {/* Queue Table */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead style={{ backgroundColor: '#020617', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' }}>
                            <tr>
                                <th style={{ padding: '14px 16px' }}>Ticket ID</th>
                                <th style={{ padding: '14px 16px' }}>Employee</th>
                                <th style={{ padding: '14px 16px' }}>Category</th>
                                <th style={{ padding: '14px 16px' }}>Subject & Description</th>
                                <th style={{ padding: '14px 16px' }}>Priority</th>
                                <th style={{ padding: '14px 16px' }}>Status</th>
                                <th style={{ padding: '14px 16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Loading ticket queue...</td></tr>
                            ) : filteredTickets.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No tickets found matching the criteria.</td></tr>
                            ) : (
                                filteredTickets.map(t => {
                                    const empDisplayName = t.employee ? `#${t.employee.empId} - ${t.employee.employeeName}` : 'Unknown';
                                    const categoryText = t.ticketCategory || t.category || 'GENERAL_QUERY';

                                    return (
                                        <tr key={t.ticketId} style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '14px 16px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 'bold' }}>#TK-{t.ticketId}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <strong style={{ color: '#f8fafc' }}>{empDisplayName}</strong>
                                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.employee ? t.employee.department : ''}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}><span style={{ color: '#38bdf8', fontWeight: 600 }}>{categoryText}</span></td>
                                            <td style={{ padding: '14px 16px', maxWidth: '380px' }}>
                                                <strong style={{ color: '#f8fafc' }}>{t.subject}</strong>
                                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{t.description}</div>
                                                {t.resolutionRemarks && (
                                                    <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>
                                                        <strong>HR Remark:</strong> {t.resolutionRemarks}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ color: getPriorityColor(t.priority), fontWeight: 700 }}>{t.priority}</span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, ...getStatusBadgeStyle(t.status) }}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <button
                                                    onClick={() => openActionModal(t)}
                                                    style={{ backgroundColor: '#8b5cf6', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    ⚙️ Action
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for HR Resolution */}
            {selectedTicket && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px'
                }}>
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', width: '100%', maxWidth: '550px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Update Status for Ticket #TK-{selectedTicket.ticketId}</h3>
                            <button onClick={closeActionModal} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', border: '1px solid #334155' }}>
                                <p style={{ color: '#38bdf8', fontWeight: 600, marginBottom: '4px' }}>
                                    Raised by: #{selectedTicket.employee?.empId || '-'} {selectedTicket.employee?.employeeName || '-'} | Subject: {selectedTicket.subject}
                                </p>
                                <p style={{ color: '#cbd5e1' }}>Description: {selectedTicket.description}</p>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Set Ticket Status</label>
                                <select
                                    value={modalStatus}
                                    onChange={(e) => setModalStatus(e.target.value)}
                                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
                                >
                                    <option value="IN_PROGRESS">IN_PROGRESS (Under Verification)</option>
                                    <option value="RESOLVED">RESOLVED (Issue Solved)</option>
                                    <option value="CLOSED">CLOSED (Closed with explanation)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>HR Resolution Remarks / Action Taken</label>
                                <textarea
                                    value={modalRemarks}
                                    onChange={(e) => setModalRemarks(e.target.value)}
                                    rows="4"
                                    placeholder="e.g. Verified attendance log. Deduction reversed and amount will reflect in next payout cycle."
                                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    onClick={closeActionModal}
                                    style={{ background: '#334155', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveResolution}
                                    disabled={submitting}
                                    style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                >
                                    {submitting ? 'Saving...' : '💾 Save & Update Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}