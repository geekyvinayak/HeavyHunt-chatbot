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
    const { user_email, querySummary } = await request.json();

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
