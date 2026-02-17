import React, { forwardRef } from 'react';
import { Award, Star } from 'lucide-react';

interface CertificateProps {
    studentName: string;
    courseName: string;
    date: string;
    certificateId: string;
    instructorName?: string;
    instructorTitle?: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateProps>(
    ({ studentName, courseName, date, certificateId, instructorName = "Dr. Anil Mehta", instructorTitle = "Lead Instructor" }, ref) => {
        return (
            <div ref={ref} className="certificate-container" style={{ position: 'relative', width: '1123px', height: '794px', margin: '0 auto' }}>
                {/* CSS Reset for html2canvas to avoid 'lab' color issues from global styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .certificate-container * {
                        border-color: transparent; /* Reset global border colors */
                        box-sizing: border-box;
                    }
                    /* Ensure print visibility */
                    @media print {
                        .certificate-container {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                `}} />

                <div
                    // Main Certificate Body
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                        color: '#0f172a',
                        fontFamily: "'Cinzel', 'Times New Roman', serif",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        overflow: 'hidden'
                    }}
                >
                    {/* Ornate Border Layer 1 (Outer Gold) */}
                    <div style={{
                        position: 'absolute',
                        inset: '16px',
                        border: '4px solid #D4AF37',
                        pointerEvents: 'none',
                        zIndex: 20
                    }}></div>

                    {/* Ornate Border Layer 2 (Inner Dark) */}
                    <div style={{
                        position: 'absolute',
                        inset: '24px',
                        border: '2px solid #1e293b',
                        pointerEvents: 'none',
                        zIndex: 20
                    }}></div>

                    {/* Corner Ornaments */}
                    <div style={{ position: 'absolute', inset: '16px', zIndex: 30, pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '64px', height: '64px', borderTop: '4px solid #D4AF37', borderLeft: '4px solid #D4AF37' }}></div>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '64px', height: '64px', borderTop: '4px solid #D4AF37', borderRight: '4px solid #D4AF37' }}></div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '64px', height: '64px', borderBottom: '4px solid #D4AF37', borderLeft: '4px solid #D4AF37' }}></div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '64px', height: '64px', borderBottom: '4px solid #D4AF37', borderRight: '4px solid #D4AF37' }}></div>
                    </div>

                    {/* Background Guilloche Pattern */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="guilloche" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                    <path d="M0,40 L40,0" stroke="currentColor" strokeWidth="0.5" />
                                    <path d="M0,0 L40,40" stroke="currentColor" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#guilloche)" />
                        </svg>
                    </div>

                    {/* Center Watermark */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
                        <Award style={{ width: '600px', height: '600px', color: '#0f172a' }} />
                    </div>

                    {/* Content Container */}
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '48px 64px' }}>

                        {/* Header */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ backgroundColor: '#0f172a', color: '#D4AF37', padding: '6px', borderRadius: '9999px', display: 'flex' }}>
                                    <Award style={{ width: '24px', height: '24px' }} />
                                </div>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.2em', color: '#1e293b', textTransform: 'uppercase' }}>Sarvtra Lab</span>
                            </div>
                            <h1 style={{ fontSize: '60px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px', textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}>
                                Certificate
                            </h1>
                            <h2 style={{ fontSize: '24px', fontWeight: '500', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.3em' }}>of Excellence</h2>
                        </div>

                        {/* Main Body */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flexGrow: 1, marginTop: '-16px' }}>
                            <p style={{ fontSize: '20px', fontStyle: 'italic', color: '#64748b', fontFamily: 'serif', marginBottom: '16px' }}>This distinctive award is presented to</p>

                            <div style={{ position: 'relative', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '60px', color: '#0f172a', fontStyle: 'italic', padding: '8px 48px', minWidth: '500px', position: 'relative', zIndex: 10, fontWeight: 'bold', fontFamily: "'Great Vibes', cursive, 'Times New Roman'" }}>
                                    {studentName}
                                </h3>
                                {/* Underlines */}
                                <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '75%', height: '2px', background: "linear-gradient(90deg, transparent, #94a3b8, transparent)" }}></div>
                                <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '50%', height: '1px', background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}></div>
                            </div>

                            <p style={{ fontSize: '20px', fontStyle: 'italic', color: '#64748b', fontFamily: 'serif', marginBottom: '16px' }}>In recognition of outstanding completion of</p>

                            <h4 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', maxWidth: '896px', lineHeight: '1.25', textTransform: 'uppercase', letterSpacing: '0.025em', padding: '0 32px' }}>
                                {courseName}
                            </h4>

                            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '672px', lineHeight: '1.625', fontFamily: 'serif' }}>
                                For demonstrating exceptional technical proficiency, dedication to learning, and successful fulfillment of all curriculum requirements.
                            </p>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginTop: '16px' }}>
                            {/* Instructor Signature */}
                            <div style={{ textAlign: 'center', width: '256px', position: 'relative' }}>
                                <div style={{ fontSize: '30px', marginBottom: '4px', color: '#1e293b', transform: 'rotate(-2deg)', fontFamily: "'Great Vibes', cursive" }}>{instructorName}</div>

                                <div style={{ width: '100%', height: '2px', backgroundColor: '#1e293b', marginBottom: '8px' }}></div>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>{instructorName}</p>
                                <p style={{ fontSize: '10px', color: '#D4AF37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1' }}>{instructorTitle}</p>
                            </div>

                            {/* Official Gold Seal */}
                            <div style={{ position: 'relative', marginBottom: '-24px' }}>
                                <div style={{ width: '128px', height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    <div style={{
                                        width: '112px', height: '112px', backgroundColor: '#D4AF37', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #ffffff', position: 'relative', overflow: 'hidden',
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                                    }}>
                                        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(15, 23, 42, 0.2)', borderRadius: '9999px', margin: '2px' }}></div>
                                        <div style={{ textAlign: 'center', color: '#0f172a', zIndex: 10, transform: 'rotate(-12deg)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}><Star style={{ width: '24px', height: '24px', fill: '#0f172a' }} /></div>
                                            <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.25' }}>Sarvtra Lab<br />Certified</div>
                                        </div>
                                        {/* Ribbon tails */}
                                        <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '64px', height: '64px', backgroundColor: '#C5A028', zIndex: -10 }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Date & ID */}
                            <div style={{ textAlign: 'center', width: '256px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '4px', color: '#1e293b', fontFamily: 'serif' }}>{date}</p>
                                <div style={{ width: '100%', height: '2px', backgroundColor: '#1e293b', marginBottom: '8px' }}></div>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Date Issued</p>

                                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                                    {/* Fake QR Code */}
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '2px' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}></div>
                                    </div>
                                    <p style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px', letterSpacing: '0.05em' }}>{certificateId}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Edge */}
                    <div style={{ position: 'absolute', bottom: '16px', left: 0, width: '100%', textAlign: 'center' }}>
                        <p style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Verified Education Partner • Sarvtra Lab Systems</p>
                    </div>
                </div>
            </div>
        );
    }
);

CertificateTemplate.displayName = 'CertificateTemplate';
