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
            <div
                ref={ref}
                // Removed shadow-2xl class and used inline style to avoid 'lab' color issues
                className="min-w-[1123px] w-[1123px] min-h-[794px] h-[794px] bg-[#ffffff] text-[#0f172a] relative mx-auto box-border overflow-hidden print:shadow-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
                style={{
                    fontFamily: "'Cinzel', 'Times New Roman', serif",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
            >
                {/* Ornate Border Layer 1 (Outer Gold) */}
                <div className="absolute inset-4 border-[4px] border-[#D4AF37] pointer-events-none z-20"></div>
                {/* Ornate Border Layer 2 (Inner Dark) */}
                <div className="absolute inset-6 border-[2px] border-[#1e293b] pointer-events-none z-20"></div>
                {/* Corner Ornaments */}
                <div className="absolute inset-4 z-30 pointer-events-none">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-[4px] border-l-[4px] border-[#D4AF37]"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-[4px] border-r-[4px] border-[#D4AF37]"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[4px] border-l-[4px] border-[#D4AF37]"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[4px] border-r-[4px] border-[#D4AF37]"></div>
                </div>

                {/* Background Guilloche Pattern */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
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
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
                    <Award className="w-[600px] h-[600px] text-[#0f172a]" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full justify-between py-12 px-16">

                    {/* Header */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#0f172a] text-[#D4AF37] p-1.5 rounded-full">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-[0.2em] text-[#1e293b] uppercase">Sarvtra Lab</span>
                        </div>
                        {/* Removed drop-shadow-sm class */}
                        <h1
                            className="text-6xl font-bold text-[#0f172a] uppercase tracking-[0.15em] mb-1"
                            style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
                        >
                            Certificate
                        </h1>
                        <h2 className="text-2xl font-medium text-[#D4AF37] uppercase tracking-[0.3em]">of Excellence</h2>
                    </div>

                    {/* Main Body */}
                    <div className="flex flex-col items-center justify-center text-center flex-grow -mt-4">
                        <p className="text-xl italic text-[#64748b] font-serif mb-4">This distinctive award is presented to</p>

                        <div className="relative mb-6">
                            <h3 className="text-6xl text-[#0f172a] font-script italic px-12 py-2 min-w-[500px] relative z-10 font-bold" style={{ fontFamily: "'Great Vibes', cursive, 'Times New Roman'" }}>
                                {studentName}
                            </h3>
                            {/* Underline Decoration - Replaced classes with inline styles for gradients */}
                            <div
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[2px]"
                                style={{ background: "linear-gradient(90deg, transparent, #94a3b8, transparent)" }}
                            ></div>
                            <div
                                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[1px]"
                                style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
                            ></div>
                        </div>

                        <p className="text-xl italic text-[#64748b] font-serif mb-4">In recognition of outstanding completion of</p>

                        <h4 className="text-4xl font-bold text-[#1e293b] mb-4 max-w-4xl leading-tight uppercase tracking-wide px-8">
                            {courseName}
                        </h4>

                        <p className="text-base text-[#475569] max-w-2xl leading-relaxed font-serif">
                            For demonstrating exceptional technical proficiency, dedication to learning, and successful fulfillment of all curriculum requirements.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end w-full mt-4">
                        {/* Instructor Signature */}
                        <div className="text-center w-64 relative">
                            <div className="font-script text-3xl mb-1 text-[#1e293b] transform -rotate-2" style={{ fontFamily: "'Great Vibes', cursive" }}>{instructorName}</div>

                            <div className="w-full h-[2px] bg-[#1e293b] mb-2"></div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">{instructorName}</p>
                            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest leading-none">{instructorTitle}</p>
                        </div>

                        {/* Official Gold Seal */}
                        <div className="relative -mb-6">
                            <div className="w-32 h-32 flex items-center justify-center relative">
                                {/* Seal container - replaced shadow-lg class */}
                                <div
                                    className="w-28 h-28 bg-[#D4AF37] rounded-full flex items-center justify-center border-[5px] border-[#ffffff] relative overflow-hidden"
                                    style={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                >
                                    <div className="absolute inset-0 border-[2px] border-[#0f172a]/20 rounded-full m-0.5"></div>
                                    <div className="text-center text-[#0f172a] z-10 transform -rotate-12">
                                        <div className="flex justify-center mb-0.5"><Star className="w-6 h-6 fill-[#0f172a]" /></div>
                                        <div className="text-[8px] font-bold uppercase tracking-widest leading-tight">Sarvtra Lab<br />Certified</div>
                                    </div>
                                    {/* Ribbon tails */}
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#C5A028] transform rotate-45 -z-10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Date & ID */}
                        <div className="text-center w-64">
                            <p className="font-bold text-xl mb-1 text-[#1e293b] font-serif">{date}</p>
                            <div className="w-full h-[2px] bg-[#1e293b] mb-2"></div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">Date Issued</p>

                            <div className="mt-2 flex flex-col items-center opacity-70">
                                {/* Fake QR Code */}
                                <div className="w-10 h-10 bg-[#ffffff] border border-[#cbd5e1] p-0.5">
                                    <div className="w-full h-full bg-[#0f172a]"></div>
                                </div>
                                <p className="text-[9px] text-[#64748b] font-mono mt-0.5 tracking-wider">{certificateId}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Edge */}
                <div className="absolute bottom-4 left-0 w-full text-center">
                    <p className="text-[8px] text-[#94a3b8] uppercase tracking-[0.2em]">Verified Education Partner • Sarvtra Lab Systems</p>
                </div>
            </div>
        );
    }
);

CertificateTemplate.displayName = 'CertificateTemplate';
