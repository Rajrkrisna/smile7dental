export const triggerPrint = (printSectionId: string) => {
  // Add a print-active class to body with targeted mode
  document.body.classList.add('printing-active');
  const section = document.getElementById(printSectionId);
  if (section) {
    section.classList.add('active-print-target');
  }

  window.print();

  // Cleanup after print dialog
  setTimeout(() => {
    document.body.classList.remove('printing-active');
    if (section) {
      section.classList.remove('active-print-target');
    }
  }, 500);
};

export const exportToJSON = (data: unknown, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (rows: Record<string, unknown>[], filename: string) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
