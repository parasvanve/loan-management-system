const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  if (!email || !password) {
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password
    }
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("Email credentials missing. Skipping email notification.");
    return { skipped: true };
  }

  await mailer.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
    html
  });

  return { skipped: false };
};

module.exports = {
  sendEmail
};
