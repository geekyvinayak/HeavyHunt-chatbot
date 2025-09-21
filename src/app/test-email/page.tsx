'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function TestEmailPage() {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Test Email Functionality
            </CardTitle>
            <p className="text-gray-600">
              Test the Mandrill email integration by sending test emails
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter email address to test"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              onClick={sendTestEmail} 
              disabled={loading || !testEmail}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Test Emails...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Test Emails
                </>
              )}
            </Button>

            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                
                {result.success ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Test emails sent successfully!</span>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Results:</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Customer Email:</strong> {
                            result.results?.userEmail?.note ? 
                              `⚠️ ${result.results.userEmail.note}` : 
                              (result.results?.userEmail?.success ? '✅ Sent' : '❌ Failed')
                          }
                          {result.results?.userEmail?.messageId && result.results.userEmail.messageId !== 'disabled' && (
                            <span className="text-gray-500 ml-2">(ID: {result.results.userEmail.messageId})</span>
                          )}
                        </div>
                        <div>
                          <strong>Admin Email:</strong> {
                            result.results?.adminEmail?.note ? 
                              `⚠️ ${result.results.adminEmail.note}` : 
                              (result.results?.adminEmail?.success ? '✅ Sent' : '❌ Failed')
                          }
                          {result.results?.adminEmail?.messageId && result.results.adminEmail.messageId !== 'disabled' && (
                            <span className="text-gray-500 ml-2">(ID: {result.results.adminEmail.messageId})</span>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <div className="flex justify-between">
                            <span><strong>Customer Emails:</strong> {result.customerEmailsEnabled ? '✅ Enabled' : '❌ Disabled'}</span>
                            <span><strong>Admin Emails:</strong> {result.adminEmailsEnabled ? '✅ Enabled' : '❌ Disabled'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Test failed</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {result.error}: {result.details}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What this test does:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sends a test user confirmation email to the specified address</li>
                <li>• Sends a test admin notification email to the admin address</li>
                <li>• Verifies that Mandrill integration is working correctly</li>
                <li>• Shows message IDs for tracking purposes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
