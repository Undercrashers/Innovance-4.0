// lib/brevo.ts
import * as Brevo from '@getbrevo/brevo';

// Initialize Contacts API
const contactsApiInstance = new Brevo.ContactsApi();
contactsApiInstance.setApiKey(
  Brevo.ContactsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

// Initialize Transactional Emails API
const emailApiInstance = new Brevo.TransactionalEmailsApi();
emailApiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

interface ContactData {
  email: string;
  fullName: string;
  phone: string;
  university: string;
  gender: string;
  rollNumber: string;
  uniqueId: string;
}

/**
 * Add a new contact to Brevo when user registers
 */
export async function addContactToBrevo(data: ContactData) {
  const createContact = new Brevo.CreateContact();

  createContact.email = data.email;
  createContact.attributes = {
    FIRSTNAME: data.fullName.split(' ')[0],
    LASTNAME: data.fullName.split(' ').slice(1).join(' ') || '',
    FULLNAME: data.fullName,
    SMS: data.phone,
    UNIVERSITY: data.university,
    GENDER: data.gender,
    ROLL_NUMBER: data.rollNumber,
    UNIQUE_ID: data.uniqueId,
  };
  // Add to your list ID (from environment variable)
  const listId = parseInt(process.env.BREVO_CONTACT_LIST_ID || '2', 10);
  createContact.listIds = [listId];
  createContact.updateEnabled = true; // Update if contact already exists

  try {
    const response = await contactsApiInstance.createContact(createContact);
    console.log('Contact added to Brevo:', response);
    return { success: true, data: response };
  } catch (error: any) {
    console.error('Brevo contact error:', error?.body || error);
    // Don't throw - we don't want to fail registration if Brevo fails
    return { success: false, error: error?.body || error };
  }
}

interface EmailData {
  email: string;
  fullName: string;
  uniqueId: string;
  rollNumber: string;
  phone: string;
  university: string;
}

/**
 * Send registration confirmation email with payment details
 */
export async function sendRegistrationEmail(data: EmailData) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = '🎬 Innovance 4.0 - Registration Confirmed!';
  sendSmtpEmail.sender = {
    name: process.env.BREVO_SENDER_NAME || 'Innovance 4.0',
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com',
  };
  sendSmtpEmail.to = [
    {
      email: data.email,
      name: data.fullName,
    },
  ];

  // Option 1: Use HTML content directly
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fdf6e3;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background-color: #dc2626; padding: 30px; text-align: center; border: 4px solid #000;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 32px; text-transform: uppercase;">
            🎬 Innovance 4.0
          </h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
            IOT LAB Presents
          </p>
        </div>

        <!-- Main Content -->
        <div style="background-color: white; padding: 30px; border: 4px solid #000; border-top: none;">
          
          <h2 style="color: #dc2626; margin-top: 0;">
            🎉 Registration Successful, ${data.fullName.split(' ')[0]}!
          </h2>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Welcome to the biggest tech blockbuster of the year! Your seat has been reserved.
          </p>

          <!-- Unique ID Box -->
          <div style="background-color: #fef3c7; border: 3px dashed #000; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold;">
              Your Unique Payment ID
            </p>
            <p style="margin: 0; font-size: 42px; font-weight: bold; color: #000; letter-spacing: 8px;">
              ${data.uniqueId}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #dc2626; font-weight: bold;">
              ⚠️ Save this ID for payment reference
            </p>
          </div>

          <!-- Registration Details -->
          <div style="background-color: #f3f4f6; padding: 20px; border-left: 4px solid #14b8a6; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">📋 Your Registration Details</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 5px 0;">${data.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Roll Number:</strong></td>
                <td style="padding: 5px 0;">${data.rollNumber}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 5px 0;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 5px 0;">${data.phone}</td>
              </tr>
            </table>
          </div>

          <!-- Payment Instructions -->
          <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">💳 Payment Instructions</h3>
            <ol style="margin: 0; padding-left: 20px; color: #333; line-height: 1.8;">
              <li>Click the payment link below to complete your payment</li>
              <li>Use your Unique ID <strong>${data.uniqueId}</strong> during checkout</li>
              <li>Amount: <strong>₹200</strong></li>
            </ol>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://payments.billdesk.com/bdcollect/bd/kiitereg/19154" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 16px;">
                💳 PAY NOW
              </a>
            </div>
          </div>

          <!-- Event Details -->
          <div style="background-color: #fef3c7; padding: 20px; text-align: center; margin: 20px 0; border: 2px solid #000;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">📅 Event Details</h3>
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold;">January 24-25, 2026</p>
            <p style="margin: 5px 0; color: #666;">📍 Audi 17 & Lab Complex</p>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
            Questions? Reply to this email or contact us on WhatsApp.
          </p>

        </div>

        <!-- Footer -->
        <div style="background-color: #000; padding: 20px; text-align: center; border: 4px solid #000; border-top: none;">
          <p style="color: #fbbf24; margin: 0; font-size: 14px;">
            🎬 IOT LAB - Innovance 4.0
          </p>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">
            "Future Ka Faisla, AI Ke Saath!"
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  // Option 2: Use a Brevo template instead (uncomment if using templates)
  // sendSmtpEmail.templateId = 1; // Your template ID from Brevo
  // sendSmtpEmail.params = {
  //   FULLNAME: data.fullName,
  //   UNIQUE_ID: data.uniqueId,
  //   ROLL_NUMBER: data.rollNumber,
  //   EMAIL: data.email,
  //   PHONE: data.phone,
  //   HOSTEL: data.university,
  // };

  try {
  const response = await emailApiInstance.sendTransacEmail(sendSmtpEmail);
  console.log('Email sent via Brevo:', response);
  return { success: true, messageId: response.body?.messageId };
} catch (error: any) {
  console.error('Brevo email error:', error?.body || error);
  return { success: false, error: error?.body || error };
}
}
