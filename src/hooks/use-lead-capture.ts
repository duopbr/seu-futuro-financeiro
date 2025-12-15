export function useLeadCapture() {
  const isLeadCaptured = (): boolean => {
    return document.cookie.includes('lead_captured=true');
  };

  const setLeadCaptured = () => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `lead_captured=true; expires=${expires.toUTCString()}; path=/`;
  };

  return { isLeadCaptured, setLeadCaptured };
}
