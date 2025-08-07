// utils/sendMail.js
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_TEMPLATES = {
  VERIFY_EMAIL: "verify_email.html",
  FORGOT_PASSWORD: "forgot_password.html",
};

const sendMail = async (to, subject, templateKey, data = {}) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "emailTemplates",
    templateKey
  );
  console.log("📧 Gửi mail với template:", templateKey, templatePath);
  const html = mustache.render(fs.readFileSync(templatePath, "utf8"), data);
  console.log("USER:", process.env.MAIL_USERNAME);
  console.log("PASS:", process.env.MAIL_PASSWORD);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Đại Gia Tộc" <${process.env.MAIL_USERNAME}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendMail,
  EMAIL_TEMPLATES,
};
