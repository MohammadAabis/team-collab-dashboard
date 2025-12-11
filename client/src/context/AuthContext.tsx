// // Global auth store (Memory storage for access token)
// import axios from "axios";


// import { useState, useEffect, useContext, createContext } from "react";
// // import { setupAxiosInterceptors } from "../api/axiosClient";


type User = {
  id: string;
  emaiil: string;
};

// type AuthContextType = {
//     user: User | null;
//     accessToken: string | null;
//     login:(token:string, user: User) => void;
//     logout:() => void;
//     loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({children}: {children: React.ReactNode}) =>{
//     const [user, setUser] = useState<User | null>(null);
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);


//  // 1️⃣ Try to restore session on page reload
//   const tryRefresh = async () => {
//     try {
//       const res = await axios.get("/auth/refresh", { withCredentials: true });

//       setAccessToken(res.data.accessToken);

//       // Optional: call /auth/me to get user info  
//     //   const me = await axios.get("/auth/me", {
//     //     headers: { Authorization: `Bearer ${res.data.accessToken}` },
//     //   });

//     //   setUser(me.data.user);
//     } catch (err) {
//       setUser(null);
//       setAccessToken(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Run once on page load
//   useEffect(() => {
//     tryRefresh();
//   }, []);


//     const login = (token: string, userData: User) =>{
//         setAccessToken(token); //stored in memory
//         setUser(userData);
//     }

//     const logout = () =>{
//         setAccessToken(null);
//         setUser(null)
//     }

//     return (
//         <AuthContext.Provider value={{user, accessToken, login, logout, loading}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () => useContext(AuthContext)!;

import { createContext, useState, useEffect } from "react";
import { setAccessToken } from "../utils/tokenMemory";
import axios from "../api/axiosClient";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }:{children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);

  // On page refresh → ask server for new access token
  useEffect(() => {
    const refresh = async () => {
      try {
        const { data } = await axios.get("/auth/refresh");
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };
    refresh();
  }, []);

  const login = async (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    // await axios.post("/auth/logout");
    setAccessToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
