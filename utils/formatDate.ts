export function formatDateShort(date: Date) {
    if(!date) return ""
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
  }