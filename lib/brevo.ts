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

  // Cinema-style subject line
  sendSmtpEmail.subject = `🎟️ TICKET CONFIRMED: ${data.fullName} @ Innovance 4.0`;
  
  sendSmtpEmail.sender = {
    name: process.env.BREVO_SENDER_NAME || 'IOT LAB Box Office',
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com',
  };
  sendSmtpEmail.to = [
    {
      email: data.email,
      name: data.fullName,
    },
  ];

  const firstName = data.fullName.split(' ')[0];

  // HTML Content - Bollywood/Cinema Theme
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Innovance 4.0 Ticket</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #1a1a1a;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff8e1; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        
        <div style="background-color: #b91c1c; padding: 25px; text-align: center; border-bottom: 5px solid #fbbf24; background-image: radial-gradient(#dc2626 15%, transparent 16%), radial-gradient(#dc2626 15%, transparent 16%); background-size: 20px 20px; background-position: 0 0, 10px 10px;">
          <h1 style="color: #fffbeb; margin: 0; font-size: 36px; text-transform: uppercase; letter-spacing: 2px; text-shadow: 2px 2px 0px #000;">
            🎬 Innovance 4.0
          </h1>
          <p style="color: #fbbf24; margin: 5px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase;">
            Presented by IOT LAB
          </p>
        </div>

        <div style="padding: 30px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
           
            <p style="color: #b91c1c; font-size: 24px; font-weight: bold; line-height: 1.5; margin: 0; letter-spacing: 1px;">
            Ayo diva you just reserved your seat 💅
            </p>
          </div>

          <div style="background-color: #ffffff; border: 3px dashed #000; border-radius: 8px; padding: 25px; text-align: center; position: relative; margin-bottom: 30px; box-shadow: 5px 5px 0px rgba(0,0,0,0.1);">
            <div style="position: absolute; top: 50%; left: -10px; width: 20px; height: 20px; background-color: #1a1a1a; border-radius: 50%; transform: translateY(-50%);"></div>
            <div style="position: absolute; top: 50%; right: -10px; width: 20px; height: 20px; background-color: #1a1a1a; border-radius: 50%; transform: translateY(-50%);"></div>
            
            <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">Your Unique Ticket ID</p>
            <h1 style="margin: 10px 0; font-size: 48px; color: #000; font-family: 'Courier New', monospace; letter-spacing: -2px; font-weight: 800;">
              ${data.uniqueId}
            </h1>
            <p style="margin: 0; font-size: 14px; color: #dc2626; font-weight: bold;">
              ⚠️ Keep this ID ready for the climax (Payment)
            </p>
          </div>

          <div style="text-align: center; margin: 35px 0;">
             <a href="https://payments.billdesk.com/bdcollect/bd/kiitereg/19154" style="background-color: #dc2626; color: #ffffff; padding: 20px 40px; text-decoration: none; font-size: 20px; font-weight: bold; text-transform: uppercase; border-radius: 50px; border: 4px solid #000; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: inline-block;">
               Click to Pay ₹200
            </a>
            <p style="margin-top: 15px; font-size: 13px; color: #666;">
              (Redirects to BillDesk • Secure Gateway)
            </p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-left: 5px solid #000; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #000; font-size: 18px; text-transform: uppercase;">
              📋 Cast Details
            </h3>
            <table style="width: 100%; font-size: 15px;">
              <tr>
                <td style="padding: 5px 0; color: #666; width: 40%;"><strong>Lead Actor:</strong></td>
                <td style="padding: 5px 0; font-weight: bold;">${data.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Roll Number:</strong></td>
                <td style="padding: 5px 0;">${data.rollNumber}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;"><strong>Contact:</strong></td>
                <td style="padding: 5px 0;">${data.phone}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #b91c1c; text-transform: uppercase;">
              📅 Showtimes & Venue
            </h3>
            <p style="margin: 0; font-size: 16px; font-weight: bold;">January 24-25, 2026</p>
            <p style="margin: 8px 0 0 0; color: #4b5563;"><strong>Day 1:</strong> Campus 17, Auditorium</p>
            <p style="margin: 5px 0 0 0; color: #4b5563;"><strong>Day 2:</strong> Campus 25, LT-6 (Buses mil jayenge 😋)</p>
          </div>

        </div>

        <div style="background-color: #000; padding: 25px; text-align: center;">
          <p style="color: #fbbf24; margin: 0; font-size: 18px; font-family: 'Georgia', serif; font-style: italic;">
            "Picture abhi baaki hai, mere dost!"
          </p>
          <div style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            <p style="margin: 5px 0;">IOT LAB • KIIT University</p>
            <p style="margin: 5px 0;">Having trouble? Contact us on WhatsApp.</p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const response = await emailApiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent via Brevo:', response);
    return { success: true, messageId: response.body?.messageId };
  } catch (error: any) {
    console.error('Brevo email error:', error?.body || error);
    return { success: false, error: error?.body || error };
  }
}