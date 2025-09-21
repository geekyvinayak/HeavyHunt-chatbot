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
    // Get query parameters for pagination (optional)
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const lastKey = searchParams.get('lastKey');

    // Prepare the scan command
    const scanParams: {
      TableName: string;
      Limit?: number;
      ExclusiveStartKey?: Record<string, any>;
    } = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'UserLeads',
    };

    // Add limit if provided
    if (limit) {
      scanParams.Limit = parseInt(limit);
    }

    // Add pagination if lastKey is provided
    if (lastKey) {
      try {
        scanParams.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
      } catch {
        return NextResponse.json(
          { error: "Invalid lastKey parameter" },
          { status: 400 }
        );
      }
    }

    // Execute the scan
    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    // Sort by createdAt in ascending order (oldest first, newest last)
    const sortedItems = (result.Items || []).sort((a, b) => {
      const aCreatedAt = a.createdAt || 0;
      const bCreatedAt = b.createdAt || 0;
      return aCreatedAt - bCreatedAt; // Ascending order
    });

  

    // Prepare response
    const response: {
      success: boolean;
      data: any[];
      count: number;
      lastKey?: string;
      hasMore: boolean;
    } = {
      success: true,
      data: sortedItems,
      count: sortedItems.length,
      hasMore: false,
    };

    // Add pagination info if available
    if (result.LastEvaluatedKey) {
      response.lastKey = encodeURIComponent(JSON.stringify(result.LastEvaluatedKey));
      response.hasMore = true;
    } else {
      response.hasMore = false;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error retrieving queries from DynamoDB:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve queries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for filtered queries
export async function POST(request: NextRequest) {
  try {
    const { email, startDate, endDate, limit } = await request.json();

    const scanParams: {
      TableName: string;
      FilterExpression?: string;
      ExpressionAttributeValues?: Record<string, any>;
      ExpressionAttributeNames?: Record<string, string>;
      Limit?: number;
    } = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'UserLeads',
    };

    // Add filters if provided
    const filterExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    if (email) {
      filterExpressions.push('user_email = :email');
      expressionAttributeValues[':email'] = email;
    }

    if (startDate) {
      filterExpressions.push('#timestamp >= :startDate');
      expressionAttributeValues[':startDate'] = startDate;
      scanParams.ExpressionAttributeNames = { '#timestamp': 'timestamp' };
    }

    if (endDate) {
      filterExpressions.push('#timestamp <= :endDate');
      expressionAttributeValues[':endDate'] = endDate;
      scanParams.ExpressionAttributeNames = { '#timestamp': 'timestamp' };
    }

    if (filterExpressions.length > 0) {
      scanParams.FilterExpression = filterExpressions.join(' AND ');
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    if (limit) {
      scanParams.Limit = parseInt(limit);
    }

    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    // Sort by createdAt in ascending order (oldest first, newest last)
    const sortedItems = (result.Items || []).sort((a, b) => {
      const aCreatedAt = a.createdAt || 0;
      const bCreatedAt = b.createdAt || 0;
      return aCreatedAt - bCreatedAt; // Ascending order
    });



    return NextResponse.json({
      success: true,
      data: sortedItems,
      count: sortedItems.length,
      filters: { email, startDate, endDate, limit }
    });

  } catch (error) {
    console.error('Error retrieving filtered queries:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve filtered queries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
