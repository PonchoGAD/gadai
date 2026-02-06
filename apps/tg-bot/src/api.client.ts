const API = process.env.API_URL!;

export async function createProfile(token: string, data: any) {
  return fetch(`${API}/profile`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export async function aiDialogue(token: string, message: string) {
  return fetch(`${API}/ai/dialogue`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  }).then(r => r.json());
}
