import { NextRequest, NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_transactional';

// Initialize Mailchimp Transactional (formerly Mandrill)
const mailchimpClient = mailchimp(process.env.MANDRILL_API_KEY || '');

interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  fromEmail?: string;
  fromName?: string;
}

interface LeadNotificationData {
  userEmail: string;
  leadSummary: string;
  leadContext: {
    machineType?: string;
    condition?: string;
    source?: string;
    delivery?: string;
    budget?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    let emailData: EmailData;

    switch (type) {
      case 'user_confirmation':
        emailData = await generateUserConfirmationEmail(data as LeadNotificationData);
        break;
      case 'admin_notification':
        emailData = await generateAdminNotificationEmail(data as LeadNotificationData);
        break;
      case 'custom':
        emailData = data as EmailData;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type. Use 'user_confirmation', 'admin_notification', or 'custom'" },
          { status: 400 }
        );
    }

    // Send email using Mailchimp Transactional
    const result = await mailchimpClient.messages.send({
      message: {
        from_email: emailData.fromEmail || process.env.MANDRILL_FROM_EMAIL || 'noreply@heavyhunt.com',
        from_name: emailData.fromName || process.env.MANDRILL_FROM_NAME || 'HeavyHunt Team',
        to: [
          {
            email: emailData.to,
            type: 'to'
          }
        ],
        subject: emailData.subject,
        html: emailData.htmlContent,
        text: emailData.textContent || emailData.htmlContent.replace(/<[^>]*>/g, ''),
        auto_text: true,
        track_opens: true,
        track_clicks: true,
      }
    });

    console.log('Email sent successfully:', result);

    // Handle the result properly - it could be an array or error
    const messageId = Array.isArray(result) && result.length > 0 ? (result[0] as any)?._id || (result[0] as any)?.message_id : 'unknown';

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Generate user confirmation email
async function generateUserConfirmationEmail(data: LeadNotificationData): Promise<EmailData> {
  const { userEmail, leadContext, leadSummary, sessionId } = data;
  const firstName = leadContext.name || 'Valued Customer';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HeavyHunt - Your Machinery Inquiry</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #000 0%, #333 100%); color: #fdc820; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .summary-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #fdc820; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .cta-button { display: inline-block; background: #fdc820; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏗️ HeavyHunt</h1>
          <p>Heavy Machinery Solutions</p>
        </div>
        
        <div class="content">
          <h2>Thank you for your inquiry, ${firstName}!</h2>
          
          <p>We've received your heavy machinery request  and our team is already working on finding the perfect solution for you.</p>
          <p>Ref no for this conversation: ${sessionId}</p>
          <div class="summary-box">
            <h3>📋 Your Inquiry Summary</h3>
            <div class="detail-row">
              <span class="detail-label">Machine Type:</span>
              <span class="detail-value">${leadContext.machineType || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Condition:</span>
              <span class="detail-value">${leadContext.condition || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Source Preference:</span>
              <span class="detail-value">${leadContext.source || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Delivery Timeline:</span>
              <span class="detail-value">${leadContext.delivery || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Budget Range:</span>
              <span class="detail-value">${leadContext.budget || 'Not specified'}</span>
            </div>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our machinery experts will review your requirements</li>
            <li>We'll source the best options from our network of suppliers</li>
            <li>You'll receive detailed quotes within 24-48 hours</li>
            <li>Our team will contact you at ${userEmail} to discuss next steps</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="mailto:info@heavyhunt.com" class="cta-button">Contact Our Team</a>
          </div>
        </div>
        
        <div class="footer">
          <p>HeavyHunt - Your trusted partner for heavy machinery solutions</p>
          <p>📧 info@heavyhunt.com | 🌐 www.heavyhunt.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: userEmail,
    subject: `🏗️ HeavyHunt - Your ${leadContext.machineType || 'Machinery'} Inquiry Confirmation`,
    htmlContent,
    fromEmail: process.env.MANDRILL_FROM_EMAIL || 'noreply@heavyhunt.com',
    fromName: 'HeavyHunt Team'
  };
}

// Generate admin notification email
async function generateAdminNotificationEmail(data: LeadNotificationData): Promise<EmailData> {
  const { userEmail, leadContext, leadSummary } = data;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@heavyhunt.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead - HeavyHunt</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #fdc820; color: #000; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .lead-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #fdc820; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .priority { background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .summary-text { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Lead Alert</h1>
          <p>HeavyHunt Lead Management System</p>
        </div>
        
        <div class="content">
          <div class="priority">HIGH PRIORITY</div>
          
          <h2>New Customer Inquiry Received</h2>
          
          <div class="lead-box">
            <h3>👤 Customer Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${leadContext.name || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${userEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${leadContext.phone || 'Not provided'}</span>
            </div>
          </div>
          
          <div class="lead-box">
            <h3>🏗️ Machinery Requirements</h3>
            <div class="detail-row">
              <span class="detail-label">Machine Type:</span>
              <span class="detail-value">${leadContext.machineType || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Condition:</span>
              <span class="detail-value">${leadContext.condition || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Source:</span>
              <span class="detail-value">${leadContext.source || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Delivery:</span>
              <span class="detail-value">${leadContext.delivery || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Budget:</span>
              <span class="detail-value">${leadContext.budget || 'Not specified'}</span>
            </div>
          </div>
          
          <div class="summary-text">
            <h4>📝 Full Summary:</h4>
            <p>${leadSummary}</p>
          </div>
          
          <p><strong>⏰ Action Required:</strong> Please contact this lead within 2 hours for best conversion rates.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${userEmail}" style="background: #fdc820; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Reply to Customer</a>
            <a href="${process.env.ADMIN_DASHBOARD_URL || '/admin'}" style="background: #333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: adminEmail,
    subject: `🚨 New Lead: ${leadContext.machineType || 'Machinery'} Inquiry from ${leadContext.name || 'Customer'}`,
    htmlContent,
    fromEmail: process.env.MANDRILL_FROM_EMAIL || 'noreply@heavyhunt.com',
    fromName: 'HeavyHunt Lead System'
  };
}
