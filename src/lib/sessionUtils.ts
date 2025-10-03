/**
 * Session format utilities
 * Backend format: 2024-25
 * Display format: 2024-2025
 */

/**
 * Convert session to backend format (2024-25)
 */
export const toBackendSession = (session: string): string => {
  if (!session) return '';
  
  // If already in backend format (2024-25), return as is
  if (/^\d{4}-\d{2}$/.test(session)) {
    return session;
  }
  
  // Convert from display format (2024-2025) to backend format (2024-25)
  if (/^\d{4}-\d{4}$/.test(session)) {
    const [year1, year2] = session.split('-');
    return `${year1}-${year2.slice(-2)}`;
  }
  
  return session;
};

/**
 * Convert session to display format (2024-2025)
 */
export const toDisplaySession = (session: string): string => {
  if (!session) return '';
  
  // If already in display format (2024-2025), return as is
  if (/^\d{4}-\d{4}$/.test(session)) {
    return session;
  }
  
  // Convert from backend format (2024-25) to display format (2024-2025)
  if (/^\d{4}-\d{2}$/.test(session)) {
    const [year1, year2] = session.split('-');
    const fullYear2 = `20${year2}`;
    return `${year1}-${fullYear2}`;
  }
  
  return session;
};

/**
 * Compare two sessions regardless of format
 */
export const sessionsMatch = (session1: string, session2: string): boolean => {
  if (!session1 || !session2) return false;
  return toBackendSession(session1) === toBackendSession(session2);
};

/**
 * Get current session in backend format
 */
export const getCurrentSession = (): string => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}-${nextYear.toString().slice(-2)}`;
};

/**
 * Get current session in display format
 */
export const getCurrentSessionDisplay = (): string => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}-${nextYear}`;
};
