import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { error: "testEmail is required" },
        { status: 400 }
      );
    }

    // Test data for email
    const testData = {
      userEmail: testEmail,
      leadSummary: "This is a test email to verify Mandrill integration is working correctly.",
      leadContext: {
        machineType: "Test Excavator",
        condition: "New",
        source: "Local",
        delivery: "ASAP",
        budget: "50000 USD",
        firstName: "Test",
        lastName: "User",
        email: testEmail,
        phone: "123-456-7890"
      }
    };

    // Send test user confirmation email (only if enabled)
    const sendCustomerEmails = process.env.SEND_CUSTOMER_EMAILS !== 'false';
    let userResult = null;
    const results: any = {};
    
    if (sendCustomerEmails) {
      const userEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'user_confirmation',
          data: testData
        })
      });

      userResult = await userEmailResponse.json();
      results.userEmail = {
        success: userEmailResponse.ok,
        messageId: userResult.messageId || 'unknown'
      };
    } else {
      results.userEmail = {
        success: false,
        messageId: 'disabled',
        note: 'Customer emails disabled (SEND_CUSTOMER_EMAILS=false)'
      };
    }

    // Send test admin notification email (only if enabled)
    const sendAdminEmails = process.env.SEND_ADMIN_EMAILS === 'true';
    let adminResult = null;
    
    if (sendAdminEmails) {
      const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'admin_notification',
          data: testData
        })
      });

      adminResult = await adminEmailResponse.json();
      results.adminEmail = {
        success: adminEmailResponse.ok,
        messageId: adminResult.messageId || 'unknown'
      };
    } else {
      results.adminEmail = {
        success: false,
        messageId: 'disabled',
        note: 'Admin emails disabled (SEND_ADMIN_EMAILS=false)'
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Test emails sent successfully',
      results,
      customerEmailsEnabled: sendCustomerEmails,
      adminEmailsEnabled: sendAdminEmails
    });

  } catch (error) {
    console.error('Error sending test emails:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send test emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
