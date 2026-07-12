/**
 * Converted an array of objects into a standard comma-separated values (CSV) string.
 */
export function convertToCSV(data: Record<string, any>[], fields?: string[]): string {
  if (data.length === 0) return '';

  const headers = fields || Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map(header => `"${header.replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const stringified = val === null || val === undefined ? '' : String(val);
      // Escape double quotes inside values
      return `"${stringified.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}
