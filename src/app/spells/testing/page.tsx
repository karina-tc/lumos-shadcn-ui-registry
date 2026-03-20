'use client';

import { useState } from 'react';
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { LumosCard } from '@/components/lumos-card';
import { LumosBadge } from '@/components/lumos-badge';
import { LumosButton } from '@/components/lumos-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const trendData = [
  { day: 'Mar 13', count: 12 },
  { day: 'Mar 14', count: 18 },
  { day: 'Mar 15', count: 15 },
  { day: 'Mar 16', count: 22 },
  { day: 'Mar 17', count: 19 },
  { day: 'Mar 18', count: 25 },
  { day: 'Mar 19', count: 28 },
  { day: 'Mar 20', count: 32 },
];

const recentReviews = [
  {
    id: 'REV-2024-0847',
    user: 'alice@company.com',
    accessType: 'Admin Dashboard',
    status: 'approved',
    assignee: 'John Smith',
    date: '2026-03-20',
  },
  {
    id: 'REV-2024-0846',
    user: 'bob@company.com',
    accessType: 'Database Access',
    status: 'pending',
    assignee: 'Sarah Chen',
    date: '2026-03-20',
  },
  {
    id: 'REV-2024-0845',
    user: 'carol@company.com',
    accessType: 'API Keys',
    status: 'denied',
    assignee: 'Marcus Johnson',
    date: '2026-03-19',
  },
  {
    id: 'REV-2024-0844',
    user: 'diana@company.com',
    accessType: 'Cloud Console',
    status: 'approved',
    assignee: 'John Smith',
    date: '2026-03-19',
  },
  {
    id: 'REV-2024-0843',
    user: 'evan@company.com',
    accessType: 'Code Repository',
    status: 'pending',
    assignee: 'Sarah Chen',
    date: '2026-03-18',
  },
  {
    id: 'REV-2024-0842',
    user: 'fiona@company.com',
    accessType: 'Admin Dashboard',
    status: 'approved',
    assignee: 'Marcus Johnson',
    date: '2026-03-18',
  },
];

const statusColors = {
  approved: 'success',
  denied: 'destructive',
  pending: 'warning',
} as const;

const statusLabels = {
  approved: 'Approved',
  denied: 'Denied',
  pending: 'Pending',
};

export default function AccessReviewsDashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [statusFilter, setStatusFilter] = useState('all');

  const pendingCount = recentReviews.filter((r) => r.status === 'pending').length;
  const approvedCount = recentReviews.filter((r) => r.status === 'approved').length;
  const deniedCount = recentReviews.filter((r) => r.status === 'denied').length;
  const totalReviews = recentReviews.length;
  const completionRate = Math.round(
    ((approvedCount + deniedCount) / totalReviews) * 100
  );

  const maxCount = Math.max(...trendData.map((d) => d.count));
  const filteredReviews =
    statusFilter === 'all'
      ? recentReviews
      : recentReviews.filter((r) => r.status === statusFilter);

  return (
    <LumosLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Access Reviews"
          description="Monitor and manage identity access reviews across your organization"
        />

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LumosCard>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Pending Reviews
              </p>
              <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">
                Awaiting action
              </p>
            </div>
          </LumosCard>

          <LumosCard>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-foreground">
                {completionRate}%
              </p>
              <p className="text-xs text-muted-foreground">
                {approvedCount + deniedCount} of {totalReviews} reviewed
              </p>
            </div>
          </LumosCard>

          <LumosCard>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">
                Access granted
              </p>
            </div>
          </LumosCard>

          <LumosCard>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Denied</p>
              <p className="text-3xl font-bold text-red-600">{deniedCount}</p>
              <p className="text-xs text-muted-foreground">
                Access revoked
              </p>
            </div>
          </LumosCard>
        </div>

        {/* Trend Chart */}
        <LumosCard>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              30-Day Review Trend
            </h3>
            <div className="flex items-end gap-2 h-48">
              {trendData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center">
                    <div
                      className="bg-primary rounded-t transition-all hover:opacity-80"
                      style={{
                        height: `${(data.count / maxCount) * 150}px`,
                        width: '100%',
                        minHeight: '4px',
                      }}
                      title={`${data.day}: ${data.count} reviews`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground text-center truncate w-full">
                    {data.day.split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </LumosCard>

        {/* Recent Reviews Table */}
        <LumosCard>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Reviews ({filteredReviews.length})
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Access Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-mono text-sm">
                        {review.id}
                      </TableCell>
                      <TableCell className="text-sm">{review.user}</TableCell>
                      <TableCell className="text-sm">
                        {review.accessType}
                      </TableCell>
                      <TableCell>
                        <LumosBadge variant={statusColors[review.status]}>
                          {statusLabels[review.status]}
                        </LumosBadge>
                      </TableCell>
                      <TableCell className="text-sm">{review.assignee}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {review.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </LumosCard>
      </div>
    </LumosLayout>
  );
}
