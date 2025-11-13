import { saveContact } from "../models/contactModel.js";
import nodemailer from "nodemailer";

export const submitContact = async (req, res) => {
  try {
    console.log("📩 Incoming Request Body:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ error: "All fields required" });

    console.log("💾 Saving contact to database...");
    const contact = await saveContact(name, email, message);
    console.log("✅ Contact saved:", contact);

    console.log("📧 Preparing to send email...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
    console.log("✅ Email sent successfully!");

    res.status(201).json({
      message: "Message saved and email sent successfully!",
      data: contact,
    });
  } catch (err) {
    console.error("❌ Error in submitContact:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
