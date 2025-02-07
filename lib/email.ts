import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(email: string) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: 'Please click the link to reset your password.',
    };

    await transporter.sendMail(mailOptions);
}
