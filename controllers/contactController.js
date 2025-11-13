import { saveContact } from "../models/contactModel.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ error: "All fields required" });

    console.log("📩 Incoming Request Body:", req.body);

    // Save to DB
    console.log("💾 Saving contact to database...");
    const contact = await saveContact(name, email, message);
    console.log("✅ Contact saved:", contact);

    // Send Email to Admin via Resend
    console.log("📧 Sending email via Resend...");

    const response = await resend.emails.send({
      from: "ElekGo <noreply@kartik.example.com>", // you can use your verified domain or keep 'onresend.com' default
      to: process.env.ADMIN_EMAIL,
      subject: "📬 New Contact Form Submission",
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    console.log("✅ Email sent successfully:", response);

    res.status(201).json({
      message: "Message saved and email sent successfully!",
      data: contact,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
