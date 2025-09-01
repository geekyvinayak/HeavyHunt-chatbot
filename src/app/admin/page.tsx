'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, RefreshCw, Download } from 'lucide-react';

interface QueryData {
  id: string;
  user_email: string;
  querySummary: string;
  timestamp: string;
  createdAt: number;
}

interface ApiResponse {
  success: boolean;
  data: QueryData[];
  count: number;
  hasMore: boolean;
  lastKey?: string;
}

export default function AdminPage() {
  const [queries, setQueries] = useState<QueryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredQueries, setFilteredQueries] = useState<QueryData[]>([]);

  // Fetch all queries
  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/get-queries');

      if (!response.ok) {
        throw new Error('Failed to fetch queries');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setQueries(data.data);
        setFilteredQueries(data.data);
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter queries by email
  const handleSearch = () => {
    if (!searchEmail.trim()) {
      setFilteredQueries(queries);
      return;
    }

    const filtered = queries.filter(query =>
      query.user_email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredQueries(filtered);
  };

  // Reset search
  const handleReset = () => {
    setSearchEmail('');
    setFilteredQueries(queries);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Query Summary', 'Date', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...filteredQueries.map(query => [
        query.id,
        query.user_email,
        `"${query.querySummary.replace(/"/g, '""')}"`, // Escape quotes
        new Date(query.timestamp).toLocaleString(),
        query.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heavyhunt-queries-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Format date
 const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  });
};

  // Truncate long text
  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              🏗️ HeavyHunt Admin Dashboard
            </CardTitle>
            <p className="text-gray-600">Manage and view all user queries</p>
          </CardHeader>
        </Card>

        {/* Controls */}
        

        {/* Main Content */}
        <Card>
            <div className='flex justify-between px-8 py-3'>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">User Queries</h2>
        
       
                <div className="flex gap-2 flex-1 max-w-md">
                    <Input
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} variant="outline">
                    <Search className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                    Reset
                    </Button>
                </div>
                <div className="flex gap-2">
                <Button onClick={fetchQueries} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportToCSV} disabled={filteredQueries.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
                
            </div>
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                <span>Loading queries...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">❌ Error: {error}</div>
                <Button onClick={fetchQueries} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredQueries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                📭 No queries found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        #
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Query Summary
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueries.map((query, index) => (
                      <tr key={query.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {query.user_email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          <div title={query.querySummary}>
                            {truncateText(query.querySummary, 150)}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {formatDate(query.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}