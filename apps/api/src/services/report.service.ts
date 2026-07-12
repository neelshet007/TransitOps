import { reportRepository, ReportFilter } from '../repositories/report.repository';

export class ReportService {
  async getFleetReport(filters: ReportFilter) {
    return reportRepository.getFleetReport(filters);
  }

  async getDriverReport(filters: ReportFilter) {
    return reportRepository.getDriverReport(filters);
  }

  async getTripReport(filters: ReportFilter) {
    return reportRepository.getTripReport(filters);
  }

  async getFuelReport(filters: ReportFilter) {
    return reportRepository.getFuelReport(filters);
  }

  async getMaintenanceReport(filters: ReportFilter) {
    return reportRepository.getMaintenanceReport(filters);
  }

  async getExpenseReport(filters: ReportFilter) {
    return reportRepository.getExpenseReport(filters);
  }

  async getDashboardAnalytics() {
    return reportRepository.getDashboardAnalytics();
  }

  async getTrendsAnalytics(range: string) {
    return reportRepository.getTrendsAnalytics(range || 'monthly');
  }

  convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));

    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        let valStr = val === null || val === undefined ? '' : String(val);
        // Escape quotes and wrap in quotes if has commas or quotes
        if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n')) {
          valStr = `"${valStr.replace(/"/g, '""')}"`;
        }
        return valStr;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}

export const reportService = new ReportService();
export default reportService;
