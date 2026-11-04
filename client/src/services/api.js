const API_BASE_URL = 'http://localhost:3000';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error('Unable to reach FlimHall API');
  }

  return response.json();
}
