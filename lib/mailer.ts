import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type MailOptions = Mail.Options;

const options: SMTPTransport.Options = {
	host: process.env.EMAIL_HOST,
	port: Number(process.env.EMAIL_PORT),
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	tls: { rejectUnauthorized: false },
};

const transporter = createTransport(options);

export const sendMail = async (mailOptions: MailOptions): Promise<SMTPTransport.SentMessageInfo> => {
	try {
		const response = await transporter.sendMail(mailOptions);
		return response;
	} catch (error) {
		throw error;
	}
};
