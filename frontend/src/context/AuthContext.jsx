import { createContext, useReducer, useEffect } from 'react';
import api from '@/lib/api'; 
import { toast } from 'sonner';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to prevent premature redirects
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        isLoading: false, 
        user: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      };
    case 'STOP_LOADING':
      return { ...state, isLoading: false };
    case 'UPDATE_USER':
        return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper: Fetch fresh profile data
  const fetchUserProfile = async (userId) => {
    try {
        if(!userId) return;
        const { data } = await api.get(`/admin/info/${userId}`);
        dispatch({ type: 'UPDATE_USER', payload: data });
    } catch (err) {
        console.error("Profile fetch error", err);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      console.log("LOGIN RESPONSE DEBUG:", data); // Check your console!

      // HANDLE STRUCTURE: Check if backend returns { user: {...} } or just { ... }
      // If data.user exists, use it. Otherwise, assume data itself is the user object (minus token).
      const userObj = data.user || data; 
      const token = data.token;

      if (!token) {
          throw new Error("No token received from server");
      }

      // Save to LocalStorage
      localStorage.setItem('user', JSON.stringify(userObj)); 
      localStorage.setItem('token', token); 

      // Dispatch Update
      dispatch({ type: 'LOGIN_SUCCESS', payload: userObj });
      
      // Fetch extra details if we have an ID
      if (userObj.userId || userObj._id) {
          fetchUserProfile(userObj.userId || userObj._id);
      }
      
      return data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.info("Logged out successfully");
  };

  // Check auth on reload
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
        
        // Refresh data in background
        if (parsedUser.userId || parsedUser._id) {
            fetchUserProfile(parsedUser.userId || parsedUser._id);
        }
      } catch (e) {
        console.error("Corrupt user data", e);
        logout(); 
      }
    } else {
      dispatch({ type: 'STOP_LOADING' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};