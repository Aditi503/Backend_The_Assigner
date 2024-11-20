import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "gmail",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "aditivkulkarni5@gmail.com",
    pass: "sbvz zfdb ovhj oxdh",
  },
});


  
