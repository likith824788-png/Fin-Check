export function formatCurrency(value, currency = 'INR', unit = 'crore') {
  if (value === undefined || value === null || isNaN(value)) return '—';
  
  const num = Number(value);
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';
  
  // Per share metrics
  if (unit === 'per_share' || unit === 'per share') {
    return `${symbol}${num.toFixed(2)}`;
  }
  
  // Percentages / ratios
  if (unit === '%' || unit === 'ratio') {
    return `${num.toFixed(1)}%`;
  }
  
  const unitSuffix = unit === 'crore' ? 'Cr' : unit === 'lakh' ? 'Lakh' : unit === 'million' ? 'M' : unit === 'billion' ? 'B' : '';
  const formattedNumber = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2
  });
  
  return `${symbol}${formattedNumber}${unitSuffix ? ' ' + unitSuffix : ''}`;
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}
