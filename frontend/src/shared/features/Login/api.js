const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function parseResponse(response) {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json.detail || json.message || response.statusText || "Request failed";
    throw new Error(message);
  }
  return json;
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response);
}

export async function forgotPassword(email) {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse(response);
}

export async function verifyOtp(email, otp) {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return parseResponse(response);
}

export async function resetPassword({ email, otp, newPassword }) {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, new_password: newPassword }),
  });
  return parseResponse(response);
}
