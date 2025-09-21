# User Panel Guide

## Overview
The User Panel allows customers to view all their heavy machinery inquiries using their email address. This provides transparency and allows users to track their inquiry history.

## Access Methods

### 1. Direct URL Access
```
https://yourdomain.com/user?email=customer@example.com
```

### 2. From Chat Interface
- Complete a conversation in the chatbot
- Click "View My Inquiries" button (appears after chat completion)
- Automatically redirects to user panel with email pre-filled

### 3. From Email Confirmation
- Users receive a "View My Inquiries" button in their confirmation email
- Clicking the button takes them directly to their inquiry history

## Features

### 🔍 **Search by Email**
- Enter any email address to view associated inquiries
- Real-time search with loading states
- Error handling for invalid emails

### 📋 **Inquiry Display**
- **Chronological Order**: Newest inquiries first
- **Status Indicators**: Recent, This Week, Older
- **Reference Numbers**: Session ID for tracking
- **Complete Details**: All inquiry information displayed

### 📊 **Information Shown**
- **Inquiry Summary**: Full conversation summary
- **Machine Details**: Type, condition, source, delivery, budget
- **Contact Information**: Name, email, phone
- **Timestamps**: When inquiry was submitted
- **Reference Numbers**: For customer service tracking

### 🎨 **Professional Design**
- **Responsive Layout**: Works on all devices
- **Status Colors**: Visual indicators for inquiry age
- **Card-based Layout**: Easy to scan and read
- **HeavyHunt Branding**: Consistent with main site

## User Experience

### For Customers
1. **Easy Access**: Simple email-based lookup
2. **Complete History**: All inquiries in one place
3. **Reference Tracking**: Keep track of conversation IDs
4. **Mobile Friendly**: Works on phones and tablets

### For Support Team
1. **Customer Self-Service**: Reduces support tickets
2. **Reference Lookup**: Easy to find specific inquiries
3. **Complete Context**: All customer information visible

## Technical Details

### API Endpoint
```
GET /api/get-user-queries?email=customer@example.com
```

### Database Query
- Filters DynamoDB by `user_email` field
- Sorts by `createdAt` timestamp (newest first)
- Returns complete inquiry data

### Security
- **No Authentication Required**: Public access for customer convenience
- **Email-based Filtering**: Users can only see their own inquiries
- **No Sensitive Data**: Only inquiry information displayed

## Integration Points

### 1. Chat Interface
- Shows "View My Inquiries" button after completion
- Pre-fills email from conversation context

### 2. Email Templates
- Includes direct link to user panel
- Reference number for easy lookup

### 3. Admin Panel
- Same data source as user panel
- Additional admin-only features

## URL Examples

```
# View inquiries for specific email
/user?email=john@example.com

# View inquiries for another email
/user?email=sarah@company.com

# Access without email (shows search form)
/user
```

## Benefits

### For Business
- **Reduced Support Load**: Customers can self-serve
- **Better Customer Experience**: Easy inquiry tracking
- **Professional Image**: Modern, user-friendly interface

### For Customers
- **Transparency**: See all their inquiries
- **Convenience**: No need to contact support for status
- **Reference Tracking**: Keep track of conversation IDs
- **Mobile Access**: View inquiries on any device

## Future Enhancements

- **Status Updates**: Show inquiry progress
- **File Attachments**: View any uploaded documents
- **Export Options**: Download inquiry history
- **Notifications**: Email updates on inquiry status
