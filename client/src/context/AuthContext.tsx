import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosClient from "../api/axiosClient";
import { logoutUser, refreshToken } from "../api/auth.api";

type User = {
  id: string;
  email: string;
};

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Login: store token + user in state
  const login = useCallback((token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
  }, []);

  // Logout: call server, then clear state
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // Attach access token to every outgoing request
  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  // Wire up the refresh callback so the interceptor can update our state
  useEffect(() => {
    (axiosClient as any)._onTokenRefreshed = (
      newToken: string | null,
      newUser: User | null
    ) => {
      setAccessToken(newToken);
      setUser(newUser);
    };

    return () => {
      (axiosClient as any)._onTokenRefreshed = null;
    };
  }, []);

  // On page load / refresh: attempt silent token refresh
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        // No valid refresh token — user must log in
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    silentRefresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isLoading,
        login,
        logout,
        setAccessToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export { AuthContext };