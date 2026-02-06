export async function createProfile(token: string, data: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );

  return res.json();
}
