import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: NextRequest) {
  try {
    const { user_email, querySummary, leadContext , sessionId} = await request.json();

    // Validate required fields
    if (!user_email || !querySummary) {
      return NextResponse.json(
        { error: "email and querySummary are required" },
        { status: 400 }
      );
    }

    // Prepare the item to save
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_email,
      querySummary,
      leadContext: leadContext || {},
      sessionId,
      timestamp: new Date().toISOString(),
      createdAt: Date.now(),
    };

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'heavyhunt-queries',
      Item: item,
    });

    await docClient.send(command);

    console.log('Successfully saved query to DynamoDB:', item.id);

    // Send email notifications
    try {
      await sendEmailNotifications(user_email, querySummary, leadContext || {}, sessionId);
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Query saved successfully',
      id: item.id,
    });

  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save query',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Function to send email notifications
async function sendEmailNotifications(userEmail: string, querySummary: string, leadContext: any, sessionId: string) {
  const emailData = {
    userEmail,
    leadSummary: querySummary,
    leadContext,
    sessionId
  };

  // Send user confirmation email (only if enabled)
  const sendCustomerEmails = process.env.SEND_CUSTOMER_EMAILS !== 'false';
  
  if (sendCustomerEmails) {
    try {
      const userEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'user_confirmation',
          data: emailData
        })
      });

      if (userEmailResponse.ok) {
        console.log('User confirmation email sent successfully');
      } else {
        console.error('Failed to send user confirmation email');
      }
    } catch (error) {
      console.error('Error sending user confirmation email:', error);
    }
  } else {
    console.log('Customer email notifications disabled (SEND_CUSTOMER_EMAILS=false)');
  }

  // Send admin notification email (only if enabled)
  const sendAdminEmails = process.env.SEND_ADMIN_EMAILS === 'true';
  
  if (sendAdminEmails) {
    try {
      const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'admin_notification',
          data: emailData
        })
      });

      if (adminEmailResponse.ok) {
        console.log('Admin notification email sent successfully');
      } else {
        console.error('Failed to send admin notification email');
      }
    } catch (error) {
      console.error('Error sending admin notification email:', error);
    }
  } else {
    console.log('Admin email notifications disabled (SEND_ADMIN_EMAILS=false)');
  }
}
