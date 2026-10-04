import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const navStyle = ({ isActive }) => ({
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 600,
        padding: '8px 14px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        color: isActive ? '#38bdf8' : '#94a3b8',
        backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
        border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
    });

    return (
        <nav style={{
            maxWidth: '1250px',
            margin: '0 auto 24px auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚡ <span>HRMS Admin Console</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <NavLink to="/" style={navStyle}>👥 Directory</NavLink>
                <NavLink to="/onboard" style={navStyle}>➕ Onboarding</NavLink>
                <NavLink to="/payroll" style={navStyle}>💰 Payroll & CTC</NavLink>
                <NavLink to="/helpdesk" style={navStyle}>🎫 Helpdesk Queue</NavLink>
                <NavLink to="/offboarding" style={navStyle}>🚪 Offboarding</NavLink>
                <NavLink to="/portal" style={{
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#059669',
                    color: '#ffffff'
                }}>👤 ESS Portal ↗</NavLink>
            </div>
        </nav>
    );
}