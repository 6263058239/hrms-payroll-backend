import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Offboarding() {
    const [exits, setExits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Settlement Modal State
    const [selectedExit, setSelectedExit] = useState(null);
    const [settlementForm, setSettlementForm] = useState({
        assetClearanceDone: false,
        noDuesCleared: false,
        pendingSalaryAmount: 0,
        leaveEncashmentAmount: 0,
        gratuityAmount: 0,
        noticeShortfallDeduction: 0
    });
    const [submitting, setSubmitting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadExits = async () => {
        try {
            setLoading(true);
            const data = await api.getAllExits();
            setExits(data || []);
        } catch (err) {
            console.error(err);
            showToast('Failed to load separation queue.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExits();
    }, []);

    // Live Counters
    const totalSeparations = exits.length;
    const pendingClearances = exits.filter(e => !e.assetClearanceDone || !e.noDuesCleared).length;
    const settledCount = exits.filter(e => e.assetClearanceDone && e.noDuesCleared).length;

    // Modal Handlers
    const openSettlementModal = (exit) => {
        setSelectedExit(exit);
        setSettlementForm({
            assetClearanceDone: Boolean(exit.assetClearanceDone),
            noDuesCleared: Boolean(exit.noDuesCleared),
            pendingSalaryAmount: exit.pendingSalaryAmount || 0,
            leaveEncashmentAmount: exit.leaveEncashmentAmount || 0,
            gratuityAmount: exit.gratuityAmount || 0,
            noticeShortfallDeduction: exit.noticeShortfallDeduction || 0
        });
    };

    const closeSettlementModal = () => {
        setSelectedExit(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettlementForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (parseFloat(value) || 0)
        }));
    };

    const computedNetFnF = (
        Number(settlementForm.pendingSalaryAmount || 0) +
        Number(settlementForm.leaveEncashmentAmount || 0) +
        Number(settlementForm.gratuityAmount || 0) -
        Number(settlementForm.noticeShortfallDeduction || 0)
    );

    const handleSaveSettlement = async () => {
        setSubmitting(true);
        try {
            await api.updateSettlement(selectedExit.id, settlementForm);
            showToast(`Separation #EX-${selectedExit.id} settlement updated!`, 'success');
            closeSettlementModal();
            loadExits();
        } catch (err) {
            console.error(err);
            showToast('Failed to update settlement.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0);

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

            {/* Header */}
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
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    🚪 Employee Exit & Separation Management
                </h1>
                <button
                    onClick={loadExits}
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
                    🔄 Refresh Separation Queue
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Separations</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>{totalSeparations}</h3>
                </div>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>In Notice Period</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#fbbf24' }}>{pendingClearances}</h3>
                </div>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Pending Clearances</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#f43f5e' }}>{pendingClearances}</h3>
                </div>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Settled / Relieved</span>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px', color: '#34d399' }}>{settledCount}</h3>
                </div>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead style={{ backgroundColor: '#020617', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' }}>
                            <tr>
                                <th style={{ padding: '14px 16px' }}>Exit ID</th>
                                <th style={{ padding: '14px 16px' }}>Employee</th>
                                <th style={{ padding: '14px 16px' }}>Exit Type</th>
                                <th style={{ padding: '14px 16px' }}>Resigned On</th>
                                <th style={{ padding: '14px 16px' }}>Last Working Day</th>
                                <th style={{ padding: '14px 16px' }}>Clearance Status</th>
                                <th style={{ padding: '14px 16px' }}>F&F Settlement</th>
                                <th style={{ padding: '14px 16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Loading separations...</td></tr>
                            ) : exits.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No separation requests found.</td></tr>
                            ) : (
                                exits.map(e => {
                                    const empName = e.employee ? `#${e.employee.empId} - ${e.employee.employeeName}` : '-';
                                    const dept = e.employee ? (e.employee.department || '-') : '-';
                                    const isFullyCleared = e.assetClearanceDone && e.noDuesCleared;

                                    return (
                                        <tr key={e.id} style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '14px 16px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 'bold' }}>#EX-{e.id}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <strong style={{ color: '#f8fafc' }}>{empName}</strong>
                                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{dept}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}><span style={{ color: '#38bdf8', fontWeight: 600 }}>{e.exitType || 'RESIGNATION'}</span></td>
                                            <td style={{ padding: '14px 16px' }}>{e.resignationDate || '-'}</td>
                                            <td style={{ padding: '14px 16px' }}><strong style={{ color: '#f8fafc' }}>{e.lastWorkingDay || '-'}</strong></td>
                                            <td style={{ padding: '14px 16px' }}>
                                                {isFullyCleared ? (
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>All Cleared</span>
                                                ) : (
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>Pending</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <strong style={{ color: '#34d399' }}>{formatINR(e.finalSettlementAmount)}</strong>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <button
                                                    onClick={() => openSettlementModal(e)}
                                                    style={{ backgroundColor: '#8b5cf6', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    ⚙️ Settlement
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

            {/* Modal for Clearance & F&F Settlement */}
            {selectedExit && (
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
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', width: '100%', maxWidth: '580px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '16px 20px', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Manage Settlement for Separation #EX-{selectedExit.id}</h3>
                            <button onClick={closeSettlementModal} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', border: '1px solid #334155' }}>
                                <p style={{ color: '#38bdf8', fontWeight: 600, margin: 0 }}>
                                    Employee: #{selectedExit.employee?.empId || '-'} {selectedExit.employee?.employeeName || '-'}
                                </p>
                                <p style={{ color: '#94a3b8', marginTop: '4px', margin: 0 }}>
                                    Resigned: {selectedExit.resignationDate || '-'} | Last Working Day: {selectedExit.lastWorkingDay || '-'}
                                </p>
                            </div>

                            <h4 style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '10px' }}>1. Operational Clearances</h4>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', background: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#f8fafc' }}>
                                    <input
                                        type="checkbox"
                                        name="assetClearanceDone"
                                        checked={settlementForm.assetClearanceDone}
                                        onChange={handleFormChange}
                                    />
                                    Laptop / Asset Recovered
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#f8fafc' }}>
                                    <input
                                        type="checkbox"
                                        name="noDuesCleared"
                                        checked={settlementForm.noDuesCleared}
                                        onChange={handleFormChange}
                                    />
                                    Departmental No-Dues Cleared
                                </label>
                            </div>

                            <h4 style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '10px' }}>2. Full & Final (F&F) Financials</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Pending Salary (₹)</label>
                                    <input
                                        type="number"
                                        name="pendingSalaryAmount"
                                        value={settlementForm.pendingSalaryAmount}
                                        onChange={handleFormChange}
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none', width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Leave Encashment (₹)</label>
                                    <input
                                        type="number"
                                        name="leaveEncashmentAmount"
                                        value={settlementForm.leaveEncashmentAmount}
                                        onChange={handleFormChange}
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none', width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Gratuity Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="gratuityAmount"
                                        value={settlementForm.gratuityAmount}
                                        onChange={handleFormChange}
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none', width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Notice Shortfall Deduction (₹)</label>
                                    <input
                                        type="number"
                                        name="noticeShortfallDeduction"
                                        value={settlementForm.noticeShortfallDeduction}
                                        onChange={handleFormChange}
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none', width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                padding: '12px 16px',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '16px',
                                marginBottom: '20px'
                            }}>
                                <strong style={{ fontSize: '13px', color: '#cbd5e1' }}>Net Payable F&F Amount:</strong>
                                <strong style={{ color: '#34d399', fontSize: '17px' }}>{formatINR(computedNetFnF)}</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    onClick={closeSettlementModal}
                                    style={{ background: '#334155', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveSettlement}
                                    disabled={submitting}
                                    style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                >
                                    {submitting ? 'Saving...' : '💾 Finalize & Save Settlement'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}