const nodemailer = require("nodemailer");

exports.SendEmail = async ({ to, subject, text, html }) => {
  try {
    // ✅ setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use "smtp"
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your App Password (not your Gmail password!)
      },
    });

    // ✅ send mail
    const info = await transporter.sendMail({
      from: `"Food Delivery App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email error:", err);
    throw err;
  }
};
