
const nodemailer = require('nodemailer');
const { google } = require('googleapis'); // Import googleapis
require('dotenv').config(); // Load environment variables from .env

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SENDER_EMAIL_ACCOUNT = process.env.EMAIL_FROM_ADDRESS; // The Gmail account that granted access
const APP_PASSWORD=process.env.APP_PASSWORD

// Initialize the Google OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const createTransporter = async () => {
   try {

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Specify Gmail service
      auth: {
        // type: 'OAuth2',         
        user: SENDER_EMAIL_ACCOUNT, 
        // clientId: CLIENT_ID,    // Your OAuth client ID
        // clientSecret: CLIENT_SECRET, // Your OAuth client secret
        // refreshToken: REFRESH_TOKEN, // Your refresh token
        // accessToken: accessToken,    // The dynamically obtained access token
        pass:APP_PASSWORD
      },
    });
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter with OAuth2:', error);
    throw new Error('Failed to configure email service due to authentication issues.');
  }
};

const sendEmail = async ({ to, subject, user, event, seats, qrcode }) => {
  const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE
    &text=${encodeURIComponent(event.title)}
    &dates=${formatDate(event.startTime)}/${formatDate(event.endTime)}
    &details=${encodeURIComponent(event.description)}
    &location=${encodeURIComponent(event.location)}`.replace(/\n/g, '');

  let transporter;
  try {
    // Await the creation of the OAuth2-enabled transporter
    transporter = await createTransporter();

  } catch (error) {
    console.error('Email sending failed: Could not create email transporter.', error);
    throw error;
  }
  const base64Data = qrcode.replace(/^data:image\/png;base64,/, '');

  try {
    // Send the email using the configured transporter
    await transporter.sendMail({
      from: SENDER_EMAIL_ACCOUNT,
      to,
      subject,
      html: `
        <h2>Hi ${user.name},</h2>
        <p>You have successfully booked <strong>${event.title}</strong>.</p>
        <p><strong>Seats:</strong> ${seats}</p>
        <p><strong>Date:</strong> ${new Date(event.startTime).toLocaleString()}</p>
        <p>Scan the QR code below at check-in:</p>
        <img src="cid:qrcodeimage" style="width:200px; height:200px;" />
        <p><a href="${calendarLink}" target="_blank">Add to Google Calendar</a></p>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: Buffer.from(base64Data, 'base64'),
          cid: 'qrcodeimage' 
        }
      ]
    
    });
    console.log(`Email successfully sent to ${to} for event: ${event.title}`);
  } catch (emailError) {
    console.error(`Error sending email to ${to}:`, emailError);
    throw emailError;
  }
};

function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]|\.\d{3}/g, '');
}

module.exports = sendEmail;