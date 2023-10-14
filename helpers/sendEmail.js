const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "alexsirotov@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "alexv1238@gmail.com",
  from: "alexsirotov@meta.ua",
  subject: "Test email",
  html: "<p><strong>Test email</strong> from localhost:3000</p>",
};

module.exports = { transport, email };
