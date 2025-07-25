export async function fetchProblems(token, BASE_URL) {
  const res = await fetch(`${BASE_URL}/api/problems`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch problems");
  return await res.json();
}

export async function runCode({ code, language, token, BASE_URL }) {
  const res = await fetch(`${BASE_URL}/api/execute`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language, input: "" }),
  });
  return await res.json();
}
