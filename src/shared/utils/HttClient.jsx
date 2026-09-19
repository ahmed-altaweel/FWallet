const BASE_URL = "/data";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
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

async function post(endpoint, body,token) {
  
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST", 
    headers: {
       "Content-Type": "application/json"
      ,"Authorization":`Bearer ${token}`
     },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

async function get(endpoint,token) {
    
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json"
      ,"Authorization":`Bearer ${token}`
     },
  });
  return handleResponse(response);
}

export const httpClient = { get, post };

