'use client';

import { useState } from 'react';
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { LumosCard } from '@/components/lumos-card';
import { LumosBadge } from '@/components/lumos-badge';
import { LumosButton } from '@/components/lumos-button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PendingRequest {
  id: string;
  appName: string;
  appId: string;
  pendingCount: number;
  urgentCount: number;
  recentRequestor: string;
  recentEmail: string;
  requestedAt: string;
  status: 'urgent' | 'pending' | 'normal';
}

const MOCK_DATA: PendingRequest[] = [
  {
    id: '1',
    appName: 'Analytics Engine',
    appId: 'app-001',
    pendingCount: 5,
    urgentCount: 2,
    recentRequestor: 'Sarah Chen',
    recentEmail: 'sarah@company.com',
    requestedAt: '2 hours ago',
    status: 'urgent',
  },
  {
    id: '2',
    appName: 'Data Pipeline',
    appId: 'app-002',
    pendingCount: 3,
    urgentCount: 0,
    recentRequestor: 'Marcus Johnson',
    recentEmail: 'marcus@company.com',
    requestedAt: '5 hours ago',
    status: 'pending',
  },
  {
    id: '3',
    appName: 'Reporting Dashboard',
    appId: 'app-003',
    pendingCount: 8,
    urgentCount: 1,
    recentRequestor: 'Emily Rodriguez',
    recentEmail: 'emily@company.com',
    requestedAt: '1 day ago',
    status: 'urgent',
  },
  {
    id: '4',
    appName: 'API Gateway',
    appId: 'app-004',
    pendingCount: 2,
    urgentCount: 0,
    recentRequestor: 'David Park',
    recentEmail: 'david@company.com',
    requestedAt: '3 days ago',
    status: 'normal',
  },
  {
    id: '5',
    appName: 'User Management',
    appId: 'app-005',
    pendingCount: 4,
    urgentCount: 1,
    recentRequestor: 'Lisa Thompson',
    recentEmail: 'lisa@company.com',
    requestedAt: '1 day ago',
    status: 'pending',
  },
  {
    id: '6',
    appName: 'Audit Logger',
    appId: 'app-006',
    pendingCount: 1,
    urgentCount: 0,
    recentRequestor: 'James Wilson',
    recentEmail: 'james@company.com',
    requestedAt: '5 days ago',
    status: 'normal',
  },
];

export default function SpellPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const totalPending = MOCK_DATA.reduce((sum, app) => sum + app.pendingCount, 0);
  const totalUrgent = MOCK_DATA.reduce((sum, app) => sum + app.urgentCount, 0);
  const appsAffected = MOCK_DATA.length;

  const filteredData = MOCK_DATA.filter((app) =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <LumosLayout>
      <div className="space-y-8 p-8">
        <PageHeader
          title="Access Reviews"
          description="Review and manage pending access requests across your applications"
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <LumosCard className="shadow-none p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Pending
              </p>
              <p className="text-3xl font-bold">{totalPending}</p>
              <p className="text-xs text-muted-foreground">across all apps</p>
            </div>
          </LumosCard>

          <LumosCard className="shadow-none p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Urgent Requests
              </p>
              <p className="text-3xl font-bold text-red-600">{totalUrgent}</p>
              <p className="text-xs text-muted-foreground">
                require immediate attention
              </p>
            </div>
          </LumosCard>

          <LumosCard className="shadow-none p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Apps Affected
              </p>
              <p className="text-3xl font-bold">{appsAffected}</p>
              <p className="text-xs text-muted-foreground">
                with pending requests
              </p>
            </div>
          </LumosCard>
        </div>

        {/* Search and Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search apps by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <LumosCard className="shadow-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App Name</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Urgent</TableHead>
                  <TableHead>Recent Requestor</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.appName}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {app.pendingCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {app.urgentCount > 0 && (
                        <span className="font-semibold text-red-600">
                          {app.urgentCount}
                        </span>
                      )}
                      {app.urgentCount === 0 && (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{app.recentRequestor}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.recentEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {app.requestedAt}
                    </TableCell>
                    <TableCell>
                      <LumosBadge variant={getBadgeVariant(app.status)}>
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </LumosBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <LumosButton size="sm">Review</LumosButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </LumosCard>

          {filteredData.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-border bg-muted/30 py-12">
              <p className="text-muted-foreground">
                No apps found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </LumosLayout>
  );
}
