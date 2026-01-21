import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import constant from "../constants/constant";

// ----------------------------------------------------------
// AXIOS INSTANCE
// ----------------------------------------------------------
const axiosInstance = axios.create({
  baseURL: constant.appBaseUrl,
});

// ----------------------------------------------------------
// PUBLIC ENDPOINTS (No token needed)
// ----------------------------------------------------------
const publicEndpoints = [
  "api/auth/login/",
  "/api/auth/register/",
  "/api/auth/otp/",
];

// ----------------------------------------------------------
// REQUEST INTERCEPTOR → Attach token for protected APIs
// ----------------------------------------------------------
// ----------------------------------------------------------
// REQUEST INTERCEPTOR → Attach token for protected APIs
// ----------------------------------------------------------
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  const isPublic = publicEndpoints.some((endpoint) =>
    config.url.includes(endpoint)
  );

  if (!isPublic && token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// ----------------------------------------------------------
// RESPONSE INTERCEPTOR (Auto-Refresh Logic)
// ----------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // IF 401 Unauthorized AND NOT already retried
    const isLoginRequest = originalRequest.url && originalRequest.url.includes("api/auth/login");
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
            // No refresh token -> Logout
            await logoutUser();
            return Promise.reject(error);
        }

        // Call Refresh API
        // Adjust endpoint based on your backend: /api/token/refresh/ is common
        const res = await axios.post(`${constant.appBaseUrl}/api/token/refresh/`, {
            refresh: refreshToken
        });

        if (res.data.access) {
            await saveToken(res.data.access, res.data.refresh || refreshToken);
            
            // Retry original request with new token
            originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
            return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed -> Logout
        console.log("❌ REFRESH FAILED:", refreshError?.response?.data || refreshError.message);
        console.log("Session expired, logging out...");
        await logoutUser();
        return Promise.reject(refreshError);
      }
    }

    console.log("🔥 AXIOS ERROR:", JSON.stringify(error, null, 2));

    if (error.response) {
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      return Promise.reject("Server did not respond");
    }
    return Promise.reject(error.message);
  }
);


// ----------------------------------------------------------
// TOKEN HELPERS
// ----------------------------------------------------------
export async function saveToken(accessToken, refreshToken) {
  await AsyncStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    await AsyncStorage.setItem("refreshToken", refreshToken);
  }
}

export async function logoutUser() {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
}

// ----------------------------------------------------------
// AUTH APIS (ONLY THESE ARE ACTIVE NOW)
// ----------------------------------------------------------

// LOGIN → JSON body
export function login(payload) {
  return axiosInstance.post("/api/auth/login/", payload);
}

// REGISTER → multipart/form-data
export function signup(formData) {
  return axiosInstance.post("/api/auth/register/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// UPDATE PROFILE → multipart/form-data
export const updateProfile = async (formData) => {
  const res = await axiosInstance.patch("/api/auth/update-profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


export function getCategories() {
  return axiosInstance.get("/api/categories/", {
    headers: {
      Accept: "application/json",
    },
  });
}


// ⭐ NEW — Banners API
export const getBanners = async () => {
  return await axiosInstance.get("/api/banners/");
};

export const getOffers = async () => {
    const res = await axiosInstance.get("/api/offers/");
    return res.data;
};

export const getOfferById = async (id) => {
    const res = await axiosInstance.get(`/api/offers/${id}/`);
    return res.data;
};




export const getSingleProductById = async (id) => {
  const res = await axiosInstance.get(`api/product/${id}/`);
  return res.data; // 🔥 ONLY ARRAY RETURN
};
export const getHomeProducts = async () => {
  const res = await axiosInstance.get(`api/home/products/`);
  return res.data; // 🔥 ONLY ARRAY RETURN
};


export const getProductsByType = async (
  type,
  page,
  limit
) => {
  const res = await axiosInstance.get(
    `api/product/${type}/`,
    {
      params: {
        page,
        limit,
      },
    }
  );
  return res.data;
};

export const getProductById = async (
  id,
  page,
  limit
) => {
  const res = await axiosInstance.get(
    `api/products/${id}/`,
    {
      params: {
        page,   // pagination
        limit,  // pagination
      },
    }
  );

  return res.data;
};


export const searchProducts = async (query, page = 1, limit = 10) => {
  const res = await axiosInstance.get("/api/products/search/", {
    params: { q: query, page, limit },
  });
  return res.data;
};


// ----------------------------------------------------------
// USER ADDRESS APIs
// ----------------------------------------------------------

// Add Address
export const addAddress = async (data) => {
  const res = await axiosInstance.post("/api/user/addresses/", data);
  return res.data;
};

// Get Addresses
export const getUserAddresses = async () => {
  const res = await axiosInstance.get("/api/user/addresses/");
  return res.data;
};

// ----------------------------------------------------------
// ORDER APIs
// ----------------------------------------------------------

export const getOrders = async (status, search) => {
  const params = {};
  if (status && status !== "All") params.status = status.toLowerCase();
  if (search) params.search = search;

  const res = await axiosInstance.get("/api/orders/", { params });
  return res.data;
};

export const getSingleOrder = async (id) => {
  const res = await axiosInstance.get(`/api/orders/${id}/`);
  return res.data;
};

// ----------------------------------------------------------
// CHECKOUT & PAYMENT APIs
// ----------------------------------------------------------

// Checkout
export const checkout = async (data) => {
  // data: { address_id, items: [{ product_id, quantity }] }
  const res = await axiosInstance.post("/api/checkout/", data);
  return res.data;
};

// Payment Success
export const paymentSuccess = async (data) => {
  // data: { order_id }
  const res = await axiosInstance.post("/api/payment-success/", data);
  return res.data;
};

// RAZORPAY
export const createRazorpayOrder = async (data) => {
    const res = await axiosInstance.post("/api/razorpay/create-order/", data);
    return res.data;
};

export const verifyRazorpayPayment = async (data) => {
    const res = await axiosInstance.post("/api/razorpay/verify-payment/", data);
    return res.data;
};



// Apply Coupon
export const applyCoupon = async (data) => {
    // data: { code, cart_total }
    const res = await axiosInstance.post("/api/coupon/apply/", data);
    return res.data;
};

// DELETE ACCOUNT
export const deleteUser = async (id) => {
    const res = await axiosInstance.delete(`/api/deleteuser/${id}/`);
    return res.data;
};

export default axiosInstance;
