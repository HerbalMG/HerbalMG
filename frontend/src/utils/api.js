export async function getMatchedLocation() {
  const res = await fetch('http://localhost:3001/api/location');
  if (!res.ok) throw new Error('Failed to get location');
  return res.json();
}
