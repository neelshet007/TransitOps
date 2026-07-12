import { useState, useCallback } from 'react';

export interface Report {
  id: string;
  title: string;
  category: 'maintenance' | 'finance' | 'operations' | 'compliance';
  generated_date: string;
  size: string;
  status: 'ready' | 'processing' | 'failed';
  author: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-2026-07-01',
    title: 'Q2 Fleet Maintenance Log',
    category: 'maintenance',
    generated_date: 'Jul 10, 2026',
    size: '2.4 MB',
    status: 'ready',
    author: 'Rajesh Kumar',
  },
  {
    id: 'RPT-2026-07-02',
    title: 'Driver Hours & Compliance Audit',
    category: 'compliance',
    generated_date: 'Jul 05, 2026',
    size: '1.8 MB',
    status: 'ready',
    author: 'System',
  },
  {
    id: 'RPT-2026-07-03',
    title: 'Operational Revenue Ledger v2',
    category: 'finance',
    generated_date: 'Jun 30, 2026',
    size: '4.1 MB',
    status: 'ready',
    author: 'Amit Patel',
  },
  {
    id: 'RPT-2026-07-04',
    title: 'Volumetric Fuel Consumption',
    category: 'operations',
    generated_date: 'Jun 25, 2026',
    size: '920 KB',
    status: 'ready',
    author: 'System',
  },
  {
    id: 'RPT-2026-07-05',
    title: 'Vehicle Depreciation Report',
    category: 'finance',
    generated_date: 'Jun 15, 2026',
    size: '1.2 MB',
    status: 'ready',
    author: 'Suresh Sharma',
  },
  {
    id: 'RPT-2026-07-06',
    title: 'Upcoming Scheduled Maintenance',
    category: 'maintenance',
    generated_date: 'Jun 10, 2026',
    size: '---',
    status: 'processing',
    author: 'System',
  }
];

export function useReports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = useCallback(async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReport: Report = {
      id: `RPT-2026-07-0${reports.length + 1}`,
      title: data.title || 'Custom Export',
      category: data.category || 'operations',
      generated_date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      size: '---',
      status: 'processing',
      author: 'Current User',
    };
    setReports(prev => [newReport, ...prev]);
    setIsLoading(false);
  }, [reports]);

  const deleteReport = useCallback(async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setReports(prev => prev.filter(r => r.id !== id));
    setIsLoading(false);
  }, []);

  return {
    reports,
    isLoading,
    generateReport,
    deleteReport
  };
}
