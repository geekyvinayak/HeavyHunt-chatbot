import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Prepare the scan command with email filter
    const scanParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'heavyhunt-queries',
      FilterExpression: 'user_email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    // Execute the scan
    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    // Sort by createdAt in descending order (newest first)
    const sortedItems = (result.Items || []).sort((a, b) => {
      const aCreatedAt = a.createdAt || 0;
      const bCreatedAt = b.createdAt || 0;
      return bCreatedAt - aCreatedAt; // Descending order (newest first)
    });

  
    return NextResponse.json({
      success: true,
      data: sortedItems,
      count: sortedItems.length,
      userEmail: email
    });

  } catch (error) {
    console.error('Error retrieving user queries from DynamoDB:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve user queries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
