import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Payroll() {
    const [salaries, setSalaries] = useState([]);
    const [metrics, setMetrics] = useState({ totalEmployees: 0, totalPayrollCost: 0, totalStatutoryDeductions: 0 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        basicSalary: 0,
        hra: 0,
        da: 0,
        specialAllowance: 0,
        pfEmployeeContribution: 0
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await api.getSalaryStructures();
            setSalaries(data || []);

            // Dashboard Metrics Fetch ya Calculate
            try {
                const metricData = await api.getDashboardMetrics();
                if (metricData) {
                    setMetrics(metricData);
                } else {
                    calculateLocalMetrics(data || []);
                }
            } catch {
                calculateLocalMetrics(data || []);
            }
        } catch (err) {
            console.error('Failed to load salaries:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateLocalMetrics = (list) => {
        let totalCost = 0;
        let totalDeds = 0;
        list.forEach(sal => {
            const basic = sal.basicSalary || 0;
            const hra = sal.hra || 0;
            const da = sal.da || 0;
            const special = sal.specialAllowance || 0;
            const ded = (sal.pfEmployeeContribution || 0) + (sal.professionalTax || 0) + (sal.tdsIncomeTax || 0);

            totalCost += (basic + hra + da + special - ded);
            totalDeds += ded;
        });
        setMetrics({
            totalEmployees: list.length,
            totalPayrollCost: totalCost,
            totalStatutoryDeductions: totalDeds
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    // CSV Export
    const exportCSV = () => {
        if (!salaries.length) return;
        const headers = ["EMP ID", "Employee Name", "Basic Salary", "HRA", "DA", "Special Allowance", "Deductions", "Net Salary"];
        const rows = salaries.map(sal => {
            const empName = sal.employee ? sal.employee.employeeName : 'N/A';
            const empId = sal.employee ? sal.employee.empId : (sal.id || '-');
            const basic = sal.basicSalary || 0;
            const hra = sal.hra || 0;
            const da = sal.da || 0;
            const special = sal.specialAllowance || 0;
            const ded = (sal.pfEmployeeContribution || 0) + (sal.professionalTax || 0) + (sal.tdsIncomeTax || 0);
            const net = basic + hra + da + special - ded;
            return [empId, `"${empName}"`, basic, hra, da, special, ded, net];
        });

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary_report.csv';
        a.click();
    };

    // Payslip Generator
    const handleGeneratePayslip = (sal) => {
        const empName = sal.employee ? sal.employee.employeeName : 'N/A';
        const empId = sal.employee ? sal.employee.empId : (sal.id || '-');
        const designation = sal.employee ? (sal.employee.designation || 'Software Engineer') : 'Software Engineer';

        const basic = sal.basicSalary || 0;
        const hra = sal.hra || 0;
        const da = sal.da || 0;
        const special = sal.specialAllowance || 0;
        const pf = sal.pfEmployeeContribution || 0;
        const pt = sal.professionalTax || 0;
        const tds = sal.tdsIncomeTax || 0;
        const gross = basic + hra + da + special;
        const totalDeductions = pf + pt + tds;
        const netPay = gross - totalDeductions;

        const payslipWindow = window.open('', '_blank');
        payslipWindow.document.write(`
            <html>
            <head>
                <title>Payslip - ${empName} (#${empId})</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc; }
                    .payslip-card { max-width: 700px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                    .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
                    .header h2 { margin: 0; color: #1e3a8a; }
                    .header p { margin: 5px 0 0 0; color: #64748b; font-size: 13px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 14px; background: #f1f5f9; padding: 12px; border-radius: 6px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
                    th { background-color: #e2e8f0; font-size: 12px; text-transform: uppercase; }
                    .text-right { text-align: right; }
                    .total-row { font-weight: bold; background-color: #f8fafc; }
                    .net-salary-box { background-color: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 15px; text-align: center; border-radius: 6px; font-size: 18px; font-weight: bold; }
                    .print-btn { background-color: #2563eb; color: #fff; border: none; padding: 10px 20px; font-size: 14px; border-radius: 6px; cursor: pointer; margin-top: 20px; display: block; width: 100%; }
                    @media print { .print-btn { display: none; } }
                </style>
            </head>
            <body>
                <div class="payslip-card">
                    <div class="header">
                        <h2>KodeKrafters HRMS Platform</h2>
                        <p>Confidential Monthly Salary Slip</p>
                    </div>
                    <div class="info-grid">
                        <div><strong>Employee Name:</strong> ${empName}</div>
                        <div><strong>Employee ID:</strong> #${empId}</div>
                        <div><strong>Designation:</strong> ${designation}</div>
                        <div><strong>Pay Period:</strong> Current Month</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Earnings</th>
                                <th class="text-right">Amount (₹)</th>
                                <th>Deductions</th>
                                <th class="text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic Salary</td>
                                <td class="text-right">₹${basic}</td>
                                <td>Provident Fund (PF)</td>
                                <td class="text-right">₹${pf}</td>
                            </tr>
                            <tr>
                                <td>House Rent Allowance (HRA)</td>
                                <td class="text-right">₹${hra}</td>
                                <td>Professional Tax (PT)</td>
                                <td class="text-right">₹${pt}</td>
                            </tr>
                            <tr>
                                <td>Dearness Allowance (DA)</td>
                                <td class="text-right">₹${da}</td>
                                <td>Income Tax (TDS 10%)</td>
                                <td class="text-right">₹${tds}</td>
                            </tr>
                            <tr>
                                <td>Special Allowance</td>
                                <td class="text-right">₹${special}</td>
                                <td>-</td>
                                <td class="text-right">-</td>
                            </tr>
                            <tr class="total-row">
                                <td>Gross Earnings</td>
                                <td class="text-right">₹${gross}</td>
                                <td>Total Deductions</td>
                                <td class="text-right">₹${totalDeductions}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="net-salary-box">
                        Net Take Home Salary: ₹${netPay}
                    </div>
                    <button onclick="window.print()" class="print-btn">🖨️ Print / Save as PDF</button>
                </div>
            </body>
            </html>
        `);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete salary structure #${id}?`)) {
            try {
                await api.deleteSalaryStructure(id);
                loadData();
            } catch (err) {
                alert('Failed to delete salary record.');
            }
        }
    };

    const openEdit = (sal) => {
        const ded = (sal.pfEmployeeContribution || 0) + (sal.professionalTax || 0) + (sal.tdsIncomeTax || 0);
        setEditData({
            id: sal.id,
            basicSalary: sal.basicSalary || 0,
            hra: sal.hra || 0,
            da: sal.da || 0,
            specialAllowance: sal.specialAllowance || 0,
            pfEmployeeContribution: ded
        });
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.updateSalaryStructure(editData.id, editData);
            setEditModalOpen(false);
            loadData();
        } catch (err) {
            alert('Failed to update salary details.');
        }
    };

    const filteredSalaries = salaries.filter(sal => {
        const empName = sal.employee ? sal.employee.employeeName.toLowerCase() : '';
        const empId = sal.employee ? String(sal.employee.empId) : String(sal.id || '');
        const query = search.toLowerCase();
        return empName.includes(query) || empId.includes(query);
    });

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0);

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>💵 Employee Salary Structure Directory</h1>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Manage base salary, DA, HRA, allowances & statutory deductions mapped with PostgreSQL DB</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={exportCSV} style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>📥 Export CSV</button>
                    <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '8px 14px', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px' }}>← Employee Directory</Link>
                </div>
            </div>

            {/* Dashboard Summary Cards */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Total Active Employees</p>
                        <h3 style={{ margin: '6px 0 0 0', fontSize: '26px', fontWeight: 700, color: '#38bdf8' }}>{metrics.totalEmployees}</h3>
                    </div>
                    <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '24px' }}>👥</div>
                </div>

                <div style={{ flex: 1, minWidth: '250px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Total Monthly Payroll</p>
                        <h3 style={{ margin: '6px 0 0 0', fontSize: '26px', fontWeight: 700, color: '#34d399' }}>{formatCurrency(metrics.totalPayrollCost)}</h3>
                    </div>
                    <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '24px' }}>💵</div>
                </div>

                <div style={{ flex: 1, minWidth: '250px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Total Statutory Deductions (TDS + PF)</p>
                        <h3 style={{ margin: '6px 0 0 0', fontSize: '26px', fontWeight: 700, color: '#fbbf24' }}>{formatCurrency(metrics.totalStatutoryDeductions)}</h3>
                    </div>
                    <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '24px' }}>🔄</div>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Search Employee Name or ID..."
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', color: '#f8fafc', outline: 'none', fontSize: '14px' }}
                />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#020617', color: '#cbd5e1', textTransform: 'uppercase', fontSize: '12px' }}>
                        <tr>
                            <th style={{ padding: '14px 16px' }}>EMP ID</th>
                            <th style={{ padding: '14px 16px' }}>Employee Name</th>
                            <th style={{ padding: '14px 16px' }}>Basic Salary</th>
                            <th style={{ padding: '14px 16px' }}>HRA</th>
                            <th style={{ padding: '14px 16px' }}>DA</th>
                            <th style={{ padding: '14px 16px' }}>Special Allowance</th>
                            <th style={{ padding: '14px 16px' }}>PF / Deductions</th>
                            <th style={{ padding: '14px 16px' }}>Net Salary</th>
                            <th style={{ padding: '14px 16px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Loading salary records from database...</td></tr>
                        ) : filteredSalaries.length === 0 ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No salary records found.</td></tr>
                        ) : (
                            filteredSalaries.map(sal => {
                                const empName = sal.employee ? sal.employee.employeeName : 'N/A';
                                const empId = sal.employee ? sal.employee.empId : (sal.id || '-');
                                const basic = sal.basicSalary || 0;
                                const hra = sal.hra || 0;
                                const da = sal.da || 0;
                                const special = sal.specialAllowance || 0;
                                const ded = (sal.pfEmployeeContribution || 0) + (sal.professionalTax || 0) + (sal.tdsIncomeTax || 0);
                                const netPay = basic + hra + da + special - ded;

                                return (
                                    <tr key={sal.id} style={{ borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '14px 16px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 'bold' }}>#{empId}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#ffffff' }}>{empName}</td>
                                        <td style={{ padding: '14px 16px' }}>₹{basic}</td>
                                        <td style={{ padding: '14px 16px' }}>₹{hra}</td>
                                        <td style={{ padding: '14px 16px', color: '#38bdf8' }}>₹{da}</td>
                                        <td style={{ padding: '14px 16px' }}>₹{special}</td>
                                        <td style={{ padding: '14px 16px', color: '#f43f5e' }}>- ₹{ded}</td>
                                        <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 'bold' }}>₹{netPay}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <button onClick={() => handleGeneratePayslip(sal)} style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(56, 189, 248, 0.3)', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', cursor: 'pointer', marginRight: '4px' }}>Payslip 📄</button>
                                            <button onClick={() => openEdit(sal)} style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)', backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', cursor: 'pointer', marginRight: '4px' }}>Edit</button>
                                            <button onClick={() => handleDelete(sal.id)} style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(244, 63, 94, 0.3)', backgroundColor: 'rgba(225, 29, 72, 0.2)', color: '#f43f5e', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', width: '100%', maxWidth: '480px', padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #334155', color: '#fff' }}>Edit Salary Structure</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Basic Salary (₹)</label>
                                <input type="number" value={editData.basicSalary} onChange={(e) => setEditData({ ...editData, basicSalary: parseFloat(e.target.value) || 0 })} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', marginTop: '4px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>HRA Allowance (₹)</label>
                                <input type="number" value={editData.hra} onChange={(e) => setEditData({ ...editData, hra: parseFloat(e.target.value) || 0 })} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', marginTop: '4px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Dearness Allowance (₹)</label>
                                <input type="number" value={editData.da} onChange={(e) => setEditData({ ...editData, da: parseFloat(e.target.value) || 0 })} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', marginTop: '4px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Special Allowance (₹)</label>
                                <input type="number" value={editData.specialAllowance} onChange={(e) => setEditData({ ...editData, specialAllowance: parseFloat(e.target.value) || 0 })} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', marginTop: '4px' }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Deductions / PF (₹)</label>
                            <input type="number" value={editData.pfEmployeeContribution} onChange={(e) => setEditData({ ...editData, pfEmployeeContribution: parseFloat(e.target.value) || 0 })} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f8fafc', marginTop: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setEditModalOpen(false)} style={{ backgroundColor: '#475569', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSaveEdit} style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Update Salary</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}