'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, RefreshCw, Mail, Calendar, Wrench, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic'; 

interface UserQuery {
  id: string;
  user_email: string;
  querySummary: string;
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
  sessionId?: string;
  timestamp: string;
  createdAt: number;
}

interface ApiResponse {
  success: boolean;
  data: UserQuery[];
  count: number;
  userEmail: string;
}

export default function UserPanel() {
  const searchParams = useSearchParams();
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [searchedEmail, setSearchedEmail] = useState('');

  // Get email from URL parameters
  useEffect(() => {
    if (typeof window === "undefined") return; // prevent SSR issues
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setSearchedEmail(emailParam);
      fetchUserQueries(emailParam);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch user queries
  const fetchUserQueries = async (userEmail: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/get-user-queries?email=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user queries');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setQueries(data.data);
        setSearchedEmail(userEmail);
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }
    fetchUserQueries(email.trim());
  };

  // Format date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Get status color based on query age
  const getStatusColor = (createdAt: number) => {
    const now = Date.now();
    const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) return 'text-green-600 bg-green-50';
    if (daysDiff <= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Get status text
  const getStatusText = (createdAt: number) => {
    const now = Date.now();
    const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) return 'Recent';
    if (daysDiff <= 7) return 'This Week';
    return 'Older';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src="/heavyhuntlogo.webp" alt="Logo" width={80} height={80} className="drop-shadow-lg" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">My Inquiries</h1>
                  <p className="text-gray-600">View and track your heavy machinery inquiries</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Results Section */}
        {searchedEmail && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Inquiries for {searchedEmail}
                </h2>
                <Button onClick={() => fetchUserQueries(searchedEmail)} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mr-2" />
                  <span>Loading inquiries...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4 flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Error: {error}
                  </div>
                  <Button onClick={() => fetchUserQueries(searchedEmail)} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : queries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No inquiries found</p>
                  <p className="text-sm">No inquiries found for this email address.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queries.map((query, index) => (
                    <Card key={query.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-lg">#{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {query.leadContext.machineType || 'Heavy Machinery'} Inquiry
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(query.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.createdAt)}`}>
                              {getStatusText(query.createdAt)}
                            </div>
                            {query.sessionId && (
                              <p className="text-xs text-gray-500 mt-1">
                                Ref: {query.sessionId}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Query Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Inquiry Summary</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{query.querySummary}</p>
                        </div>

                        {/* Lead Context Details */}
                        {query.leadContext && Object.keys(query.leadContext).length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {query.leadContext.machineType && (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Machine Type</p>
                                <p className="font-medium text-gray-800">{query.leadContext.machineType}</p>
                              </div>
                            )}
                            {query.leadContext.condition && (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Condition</p>
                                <p className="font-medium text-gray-800">{query.leadContext.condition}</p>
                              </div>
                            )}
                            {query.leadContext.budget && (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                                <p className="font-medium text-gray-800">{query.leadContext.budget}</p>
                              </div>
                            )}
                            {query.leadContext.delivery && (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery</p>
                                <p className="font-medium text-gray-800">{query.leadContext.delivery}</p>
                              </div>
                            )}
                            {query.leadContext.source && (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Source</p>
                                <p className="font-medium text-gray-800">{query.leadContext.source}</p>
                              </div>
                            )}
                            {query.leadContext.name && (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Contact Name</p>
                                <p className="font-medium text-gray-800">{query.leadContext.name}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!searchedEmail && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">View Your Inquiries</h3>
                <p className="text-gray-600 mb-4">
                  Enter your email address above to view all your heavy machinery inquiries.
                </p>
                <p className="text-sm text-gray-500">
                  You can also access this page directly with: <code className="bg-gray-100 px-2 py-1 rounded">/user?email=your@email.com</code>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
