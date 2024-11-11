import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Error interface
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    console.log(import.meta.env.VITE_API_URL);
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          console.error("API Error:", error.response.data);
        } else if (error.request) {
          console.error("Network Error:", error.request);
        } else {
          console.error("Request Error:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(endpoint, {
        params,
      });
      return response as T;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(endpoint, data);
      return response as T;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response?.data) {
      return new Error(error.response.data.message || "An error occurred");
    }
    return new Error(error.message);
  }
}

export const apiService = new ApiService();
export default apiService;
