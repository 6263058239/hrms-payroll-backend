import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import EmployeeDirectory from './pages/EmployeeDirectory';
import Onboarding from './pages/Onboarding';
import Payroll from './pages/Payroll';
import Helpdesk from './pages/Helpdesk';
import Offboarding from './pages/Offboarding';
import Portal from './pages/Portal';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<EmployeeDirectory />} />
                <Route path="/onboard" element={<Onboarding />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/helpdesk" element={<Helpdesk />} />
                <Route path="/offboarding" element={<Offboarding />} />
                <Route path="/portal" element={<Portal />} />
            </Routes>
        </BrowserRouter>
    );
}