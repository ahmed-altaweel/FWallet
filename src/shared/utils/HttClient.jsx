const BASE_URL = "/data";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    // parse JSON once
    data = await response.json();
  } else {
    // non-JSON (likely HTML error page) — read as text
    const text = await response.text();
    // leave data as raw text when not JSON
    data = text;
  
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: (data && data.message) || data || "حدث خطأ غير متوقع",
    };
  }

  return data;
}

async function post(endpoint, body) {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

async function get(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(response);
}

export const httpClient = { get, post };