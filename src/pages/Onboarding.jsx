import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Onboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Complete State across all 3 steps
    const [formData, setFormData] = useState({
        // Step 1: Personal
        employeeName: '',
        officialEmail: '',
        password: '',
        contactNumber: '',
        department: 'IT',
        designation: '',
        dateOfJoining: new Date().toISOString().split('T')[0],

        // Step 2: Salary Structure
        basicSalary: 50000,
        hraAllowance: 20000,
        dearnessAllowance: 5000,
        specialAllowance: 10000,
        enablePf: true,
        enablePt: true,
        enableTds: true,

        // Step 3: Bank Details
        bankName: 'HDFC Bank',
        accountNumber: '',
        ifscCode: '',
        panNumber: '',
        aadhaarNumber: ''
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Payroll Deductions Engine Calculations
    const grossSalary = Number(formData.basicSalary || 0) + 
                        Number(formData.hraAllowance || 0) + 
                        Number(formData.dearnessAllowance || 0) + 
                        Number(formData.specialAllowance || 0);

    const pfDeduction = formData.enablePf ? 1800 : 0;
    const ptDeduction = formData.enablePt ? 200 : 0;
    const tdsDeduction = formData.enableTds ? Math.round(grossSalary * 0.10) : 0;
    const totalDeductions = pfDeduction + ptDeduction + tdsDeduction;
    const netSalary = grossSalary - totalDeductions;

    const handleNext = (e) => {
        e.preventDefault();
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Register Employee in employees table
            const empPayload = {
                employeeName: formData.employeeName,
                officialEmail: formData.officialEmail,
                password: formData.password,
                contactNumber: formData.contactNumber,
                department: formData.department,
                designation: formData.designation,
                dateOfJoining: formData.dateOfJoining,
                accountNumber: formData.accountNumber,
                bankName: formData.bankName,
                ifscCode: formData.ifscCode,
                panNumber: formData.panNumber,
                aadhaarNumber: formData.aadhaarNumber
            };

            const createdEmp = await api.onboardEmployee(empPayload);

            // 2. Automatically Link & Save in salary_structures table
            const salaryPayload = {
                employee: createdEmp,
                basicSalary: parseFloat(formData.basicSalary) || 0,
                hra: parseFloat(formData.hraAllowance) || 0,
                da: parseFloat(formData.dearnessAllowance) || 0,
                specialAllowance: parseFloat(formData.specialAllowance) || 0,
                pfEmployeeContribution: pfDeduction,
                professionalTax: ptDeduction,
                tdsIncomeTax: tdsDeduction
            };

            await api.createSalaryStructure(salaryPayload);

            showToast('Employee & Salary Structure saved successfully!', 'success');

            setTimeout(() => {
                navigate('/payroll');
            }, 1200);
        } catch (err) {
            console.error('Submission error:', err);
            showToast('Onboarding failed. Please check backend logs.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '10px 14px',
        color: '#0f172a',
        fontSize: '13px',
        outline: 'none',
        marginTop: '6px'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: 600,
        color: '#475569'
    };

    return (
        <div style={{ minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
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
                    fontWeight: 600
                }}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            <div style={{
                width: '100%',
                maxWidth: '680px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Header */}
                <div style={{ backgroundColor: '#1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>👤+</span> Employee Onboarding
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>3-Step Registration & Payroll Configuration</div>
                    </div>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Tabs / Stepper */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    {['1. Personal Info', '2. Salary Structure', '3. Bank Details'].map((stepName, idx) => (
                        <div key={idx} style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: currentStep === idx + 1 ? '#2563eb' : '#64748b',
                            borderBottom: currentStep === idx + 1 ? '2px solid #2563eb' : 'none',
                            backgroundColor: currentStep === idx + 1 ? '#ffffff' : 'transparent'
                        }}>
                            {stepName}
                        </div>
                    ))}
                </div>

                <div style={{ padding: '24px' }}>
                    {/* STEP 1: Personal Info */}
                    {currentStep === 1 && (
                        <form onSubmit={handleNext}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Step 1: Personal & Department Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input required type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="e.g. John Doe" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email Address *</label>
                                    <input required type="email" name="officialEmail" value={formData.officialEmail} onChange={handleChange} placeholder="john.doe@company.com" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Set Account Password *</label>
                                    <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a default password (e.g. Emp@123)" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone Number *</label>
                                    <input required type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+91 9876543210" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Department *</label>
                                    <select name="department" value={formData.department} onChange={handleChange} style={inputStyle}>
                                        <option value="IT">IT</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Finance">Finance</option>
                                        <option value="HR">HR</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Designation *</label>
                                    <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Software Engineer" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Date of Joining *</label>
                                    <input required type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Next</button>
                            </div>
                        </form>
                    )}

                    {/* STEP 2: Salary Structure */}
                    {currentStep === 2 && (
                        <form onSubmit={handleNext}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Step 2: Salary Structure (Payroll Engine)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Basic Salary (₹)</label>
                                    <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>HRA Allowance (₹)</label>
                                    <input type="number" name="hraAllowance" value={formData.hraAllowance} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Dearness Allowance - DA (₹)</label>
                                    <input type="number" name="dearnessAllowance" value={formData.dearnessAllowance} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Special Allowance (₹)</label>
                                    <input type="number" name="specialAllowance" value={formData.specialAllowance} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                <label style={{ ...labelStyle, fontSize: '13px' }}>Statutory Deductions Config</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                    <label style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="enablePf" checked={formData.enablePf} onChange={handleChange} />
                                        Enable Provident Fund (PF) Contribution (₹1,800)
                                    </label>
                                    <label style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="enablePt" checked={formData.enablePt} onChange={handleChange} />
                                        Enable Professional Tax (PT) Deduction (₹200)
                                    </label>
                                    <label style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="enableTds" checked={formData.enableTds} onChange={handleChange} />
                                        Enable Income Tax (TDS) Deduction (10% of Gross: ₹{tdsDeduction.toLocaleString()})
                                    </label>
                                </div>
                            </div>

                            {/* Live Calculations Preview */}
                            <div style={{ marginTop: '16px', backgroundColor: '#f1f5f9', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                                <span>Gross: ₹{grossSalary.toLocaleString()}</span>
                                <span style={{ color: '#dc2626' }}>Total Deductions: -₹{totalDeductions.toLocaleString()}</span>
                                <span style={{ color: '#059669' }}>Net In-Hand: ₹{netSalary.toLocaleString()}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                                <button type="button" onClick={handleBack} style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Next</button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Bank Details */}
                    {currentStep === 3 && (
                        <form onSubmit={handleSubmit}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Step 3: Bank Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Bank Name</label>
                                    <select name="bankName" value={formData.bankName} onChange={handleChange} style={inputStyle}>
                                        <option value="HDFC Bank">HDFC Bank</option>
                                        <option value="State Bank of India">State Bank of India (SBI)</option>
                                        <option value="ICICI Bank">ICICI Bank</option>
                                        <option value="Axis Bank">Axis Bank</option>
                                        <option value="Punjab National Bank">Punjab National Bank</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Account Number</label>
                                    <input required type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter Account Number" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>IFSC Code</label>
                                    <input required type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="e.g. HDFC0001234" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>PAN Number</label>
                                    <input required type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="E.G. ABCDE1234F" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Aadhaar Number</label>
                                    <input required type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="Enter Aadhaar Number" style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                                <button type="button" onClick={handleBack} style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                                <button type="submit" disabled={loading} style={{ backgroundColor: '#059669', color: '#fff', padding: '10px 24px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                                    {loading ? 'Submitting...' : 'Submit Onboarding'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}