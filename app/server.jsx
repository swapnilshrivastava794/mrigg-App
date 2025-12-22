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
// RESPONSE INTERCEPTOR
// ----------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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
export async function saveToken(token) {
  await AsyncStorage.setItem("accessToken", token);
}

export async function logoutUser() {
  await AsyncStorage.removeItem("accessToken");
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

export default axiosInstance;
