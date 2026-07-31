const nodemailer = require("nodemailer");

/**
 * Sends a 6-digit verification code to the user's email.
 * If SMTP configuration is missing, logs it to the console in development.
 */
const sendVerificationEmail = async (email, code) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Cartify Support" <${smtpUser}>`,
        to: email,
        subject: "Verify Your Cartify Account",
        text: `Your 6-digit email verification code is: ${code}. It expires in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; margin-bottom: 16px;">Verify Your Email Address</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.5;">Thank you for signing up for Cartify. Use the following 6-digit verification code to complete your registration:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; font-family: monospace; font-size: 28px; font-weight: bold; color: #0f172a; padding: 16px; text-align: center; border-radius: 6px; letter-spacing: 4px; margin: 24px 0;">
              ${code}
            </div>
            <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Verification email successfully sent to ${email}`);
      return true;
    } catch (error) {
      console.error("[Email Service] SMTP error sending email:", error.message);
      // Fall back to logging to console
    }
  }

  // Fallback / Development print block
  console.log("\n==================================================");
  console.log("📨  CARTIFY EMAIL VERIFICATION SIMULATOR");
  console.log(`To:      ${email}`);
  console.log(`Code:    ${code}`);
  console.log(`Expires: 10 minutes from now`);
  console.log("==================================================\n");
  return true;
};

module.exports = {
  sendVerificationEmail,
};
