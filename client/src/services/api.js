// client/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Log API URL in development (helps debug deployment issues)
if (process.env.NODE_ENV === 'development') {
  console.log("API Base URL:", API_BASE_URL);
}

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "API request failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }

      // Log detailed error for debugging
      console.error(`API Error [${response.status}]:`, {
        url,
        status: response.status,
        statusText: response.statusText,
        message: errorMessage
      });

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Enhanced error logging
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error("Network Error - Cannot reach API:", {
        url,
        message: "Check if backend is running and CORS is configured correctly",
        apiUrl: API_BASE_URL
      });
      throw new Error(`Cannot connect to server. Please check your connection and try again.`);
    }

    console.error("API Error:", {
      url,
      error: error.message,
      apiUrl: API_BASE_URL
    });
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (username, email, firstName, lastName, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Registration failed" }));
        const errorMessage = errorData.detail || errorData.message || "Registration failed. Please try again.";
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  },

  login: async (username, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network Error - Cannot reach login endpoint:", {
          url: `${API_BASE_URL}/auth/token`,
          apiUrl: API_BASE_URL
        });
        throw new Error("Cannot connect to server. Please check your connection.");
      }
      console.error("Login Error:", error);
      throw error;
    }
  },
};

// Products API calls
export const productsAPI = {
  getAll: () => fetchAPI("/products"),
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (product) =>
    fetchAPI("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  update: (id, product) =>
    fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  delete: (id) =>
    fetchAPI(`/products/${id}`, {
      method: "DELETE",
    }),
};

// Cart API calls
export const cartAPI = {
  getCart: () => fetchAPI("/cart"),
  addItem: (productId, quantity = 1) =>
    fetchAPI("/cart/add", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    }),
  updateItem: (itemId, quantity) =>
    fetchAPI(`/cart/update/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({
        quantity,
      }),
    }),
  removeItem: (itemId) =>
    fetchAPI(`/cart/remove/${itemId}`, {
      method: "DELETE",
    }),
};

export default fetchAPI;
