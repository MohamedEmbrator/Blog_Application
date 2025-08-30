const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Your Gmail Address",
        pass: "App Password",
      },
    });
    const mailOptions = {
      from: "Your Gmail Address",
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info.response);
  } catch (error) {
    throw new Error("Internal Server Error ( nodemailer )");
  }
};
