import nodemailer from 'nodemailer';
import { z } from 'zod';

// Schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export default async function handler(req, res) {
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse and validate request data
    const { name, email, message } = contactSchema.parse(req.body);
    
    console.log(`Attempting to send email from ${email} with subject: Portfolio Contact Form: Message from ${name}`);

    // Email setup
    if (!process.env.SMTP_PASS || !process.env.SENDER_EMAIL || !process.env.RECIPIENT_EMAIL) {
      throw new Error('Missing required email configuration environment variables');
    }

    const SENDER_EMAIL = process.env.SENDER_EMAIL;
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
    const SMTP_PASS = process.env.SMTP_PASS;

    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: SMTP_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: {
        name: "Jonathan Mahrt",
        address: SENDER_EMAIL
      },
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact Form: Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Message from Portfolio Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Email sent successfully");
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Email sending error:", errorMessage);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid form data", details: error.errors });
    }
    
    res.status(500).json({ message: "Failed to send email", details: errorMessage });
  }
} 