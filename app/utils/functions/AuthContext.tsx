import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '../consts';


interface User {
  token: string;
}


interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; 
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setCurrentUser({ token });
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json(); 
      if (!response.ok) {
        const error = (data && data.message) ? data.message : 'Login failed';
        throw new Error(error);
      }
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        setCurrentUser({ token: data.token });
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        setCurrentUser({ token: data.token });
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    console.log(currentUser);
    await AsyncStorage.removeItem('userToken');
    setCurrentUser(null);
  };
  

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
  
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
