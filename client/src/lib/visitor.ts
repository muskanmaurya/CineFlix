const VISITOR_ID_KEY = 'cineflix_visitor_id';

export function getVisitorId(): string {
  const existingId = localStorage.getItem(VISITOR_ID_KEY);
  if (existingId) return existingId;

  const visitorId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}