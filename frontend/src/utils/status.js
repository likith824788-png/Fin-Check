export const STATUS_CONFIG = {
  consistent: {
    label: 'Consistent',
    bg: 'bg-[#E9F8F2]',
    text: 'text-[#087F5B]',
    border: 'border-[#12A878]/30',
    dot: 'bg-[#087F5B]',
    description: 'Values match across documents after deterministic normalization.'
  },
  explained_difference: {
    label: 'Explained',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#93C5FD]/40',
    dot: 'bg-[#2563EB]',
    description: 'Values differ but verified explanatory disclosure identified in document notes.'
  },
  potential_issue: {
    label: 'Review Required',
    bg: 'bg-[#FFF4F6]',
    text: 'text-[#E45757]',
    border: 'border-[#F8D7DA]',
    dot: 'bg-[#E45757]',
    description: 'Unexplained discrepancy between matching periods and scope.'
  },
  unresolved_discrepancy: {
    label: 'High Priority',
    bg: 'bg-[#FCECEF]',
    text: 'text-[#D6336C]',
    border: 'border-[#F8D7DA]',
    dot: 'bg-[#D6336C]',
    description: 'Unresolved discrepancy requiring formal auditor reconciliation.'
  }
};

export function getStatusConfig(status) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_');
  return STATUS_CONFIG[key] || {
    label: status || 'Pending',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
    description: ''
  };
}

export const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    bg: 'bg-[#FFF4F6]',
    text: 'text-[#E45757]',
    border: 'border-[#F8D7DA]'
  },
  medium: {
    label: 'Medium',
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]'
  },
  low: {
    label: 'Low',
    bg: 'bg-[#E9F8F2]',
    text: 'text-[#087F5B]',
    border: 'border-[#A7F3D0]'
  }
};

export function getPriorityConfig(priority) {
  const key = (priority || '').toLowerCase();
  return PRIORITY_CONFIG[key] || PRIORITY_CONFIG.low;
}
