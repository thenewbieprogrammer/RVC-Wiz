import { useState, useEffect } from "react";
import { apiClient } from "~/utils/api";

interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
} {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");
        
        if (token && userData) {
          // Verify token with backend
          try {
            const response = await fetch("http://localhost:8000/api/auth/me", {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            
            if (response.ok) {
              const user = await response.json();
              setAuthState({
                isAuthenticated: true,
                user,
                isLoading: false,
              });
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user_data");
              setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Store auth data
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
        });
        
        return true;
      } else {
        console.error("Login failed:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          username: name,
          full_name: name 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Store auth data
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
        });
        
        return true;
      } else {
        console.error("Signup failed:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
    signup,
  };
}
