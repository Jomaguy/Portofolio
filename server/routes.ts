import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Verify the connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log("SMTP connection error:", error);
    } else {
      console.log("SMTP server is ready to take our messages");
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = contactSchema.parse(req.body);

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

      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Public Projects API endpoint
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  // Create HTTP server
  const server = createServer(app);
  return server;
}