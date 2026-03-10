export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function generateUmbrellaId(): string {
  return `UMB-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function calculateCost(startTimeMs: number, endTimeMs?: number): number {
  const ms = (endTimeMs ?? Date.now()) - startTimeMs;
  const hours = ms / 3600000;
  const cost = Math.ceil(hours) * 10;
  return Math.min(cost, 80);
}

export function getLiveElapsed(startTimeMs: number): string {
  return formatDuration(Date.now() - startTimeMs);
}
