export function formatDuration(duration: string): string {
  // Duration comes in PostgreSQL interval format "HH:MM:SS"
  const [hours, minutes] = duration.split(':');
  
  const formattedHours = parseInt(hours);
  const formattedMinutes = parseInt(minutes);

  if (formattedHours === 0) {
    return `${formattedMinutes}min`;
  }

  if (formattedMinutes === 0) {
    return `${formattedHours}h`;
  }

  return `${formattedHours}h ${formattedMinutes}min`;
}