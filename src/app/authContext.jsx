import { createContext, useContext } from 'react';

// Shared AuthContext and helper hook. Kept lightweight so AuthProvider
// file can remain component-only for reliable Fast Refresh behavior.
export const AuthContext = createContext({
  token: null,
  refreshToken: null,
  role: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
