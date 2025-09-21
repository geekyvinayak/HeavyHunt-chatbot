# Email Integration Setup Guide

## Mandrill/Mailchimp Transactional Configuration

### 1. Get Mandrill API Key
1. Go to [Mailchimp Transactional](https://mailchimp.com/developer/transactional/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Environment Variables
Add these variables to your `.env.local` file:

```env
# Mandrill/Mailchimp Transactional Configuration
MANDRILL_API_KEY=your_mandrill_api_key_here
MANDRILL_FROM_EMAIL=noreply@heavyhunt.com
MANDRILL_FROM_NAME=HeavyHunt Team

# Admin Configuration
ADMIN_EMAIL=admin@heavyhunt.com
ADMIN_DASHBOARD_URL=http://localhost:3000/admin
SEND_ADMIN_EMAILS=false

# Email Notifications Configuration
SEND_CUSTOMER_EMAILS=true

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Email Configuration

#### Email Configuration Options

**SEND_CUSTOMER_EMAILS Configuration**
- **`SEND_CUSTOMER_EMAILS=true`** - Sends customer confirmation emails (default)
- **`SEND_CUSTOMER_EMAILS=false`** - Disables customer confirmation emails
- **Default:** `true` (customer emails enabled by default)

**SEND_ADMIN_EMAILS Configuration**
- **`SEND_ADMIN_EMAILS=true`** - Sends admin notification emails
- **`SEND_ADMIN_EMAILS=false`** - Disables admin notification emails (default)
- **Default:** `false` (admin emails disabled by default)

**Combined Options:**
- **Both enabled** (`SEND_CUSTOMER_EMAILS=true` + `SEND_ADMIN_EMAILS=true`) - Sends both customer and admin emails
- **Customer only** (`SEND_CUSTOMER_EMAILS=true` + `SEND_ADMIN_EMAILS=false`) - Sends only customer emails (default)
- **Admin only** (`SEND_CUSTOMER_EMAILS=false` + `SEND_ADMIN_EMAILS=true`) - Sends only admin emails
- **Both disabled** (`SEND_CUSTOMER_EMAILS=false` + `SEND_ADMIN_EMAILS=false`) - No emails sent

#### Email Templates

**Customer Confirmation Email (Configurable)**
- Sent to customers when their inquiry is completed (only if `SEND_CUSTOMER_EMAILS=true`)
- Includes inquiry summary and next steps
- Professional branding with HeavyHunt logo

**Admin Notification Email (Configurable)**
- Sent to admin team when new leads are generated (only if `SEND_ADMIN_EMAILS=true`)
- Includes complete lead details and contact information
- Priority alert for immediate follow-up

### 4. Testing

To test email functionality:

1. Complete a full conversation in the chatbot
2. Check the console logs for email sending status
3. Verify emails are received at both user and admin addresses

### 5. Customization

You can customize email templates by editing:
- `src/app/api/send-email/route.ts` - Email generation functions
- Update HTML templates for branding changes
- Modify email content and styling

### 6. Production Deployment

For production:
1. Update `NEXT_PUBLIC_BASE_URL` to your production domain
2. Update `ADMIN_DASHBOARD_URL` to your production admin URL
3. Ensure all environment variables are set in your hosting platform
4. Test email delivery in production environment

## Troubleshooting

### Common Issues:
1. **API Key Error**: Verify MANDRILL_API_KEY is correct
2. **Email Not Sending**: Check console logs for error details
3. **Template Issues**: Verify HTML template syntax
4. **Domain Issues**: Ensure sender email domain is verified in Mandrill

### Debug Mode:
Enable detailed logging by checking console output when emails are sent.
