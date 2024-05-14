import { createTransport } from "nodemailer";
import dotenv from "dotenv"
dotenv.config()
export async function sendingMail({ from, to, subject, text }) {
  try {
    let mailOptions = {
      from,
      to,
      subject,
      text,
    };

    const Transporter = createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.email,
        pass: process.env.emailpassword,
      },
    });
    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}
