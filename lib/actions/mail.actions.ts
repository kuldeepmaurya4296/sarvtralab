'use server';

import nodemailer from 'nodemailer';
import { createLead } from './crm.actions';

export async function sendContactEmail(formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}) {
    const { name, email, phone, subject, message } = formData;

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS?.replace(/^["']|["']$/g, '');
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const recipient = process.env.CONTACT_FORM_RECIPIENT;

    if (!user || !pass || !recipient) {
        console.error('SMTP configuration is missing:', { user: !!user, pass: !!pass, recipient: !!recipient });
        return { success: false, error: 'Email service is not configured correctly.' };
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user,
            pass,
        },
    });

    const mailOptions = {
        from: `"Sarvtra Labs Contact" <${user}>`,
        to: recipient,
        replyTo: email,
        subject: `[Contact Form] ${subject} - from ${name}`,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}
        `.trim(),
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-top: 0;">New Contact Form Submission</h2>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                </div>
                <div style="line-height: 1.6; color: #374151;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">${message}</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    This email was sent from the contact form on Sarvtra Labs website.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);

        // Optional: Also save as a lead in CRM
        try {
            await createLead({
                name,
                email,
                phone: phone || '0000000000', // Ensure phone is provided for the model requirement
                source: 'Contact Form',
                status: 'New',
                notes: `Subject: ${subject}\nMessage: ${message}`
            });
        } catch (dbError: any) {
            // If lead already exists, it's fine, we just want the email sent
            console.warn('Could not create lead in CRM (probably exists):', dbError.message);
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email. Please try again later.' };
    }
}
