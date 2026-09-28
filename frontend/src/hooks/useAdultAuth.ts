import { useState, useEffect, useCallback } from 'react';
import { UserDTO, AuthResponseDTO } from '../types';
import { loginAdult, registerAdult, fetchCurrentUser, LoginPayload, RegisterPayload } from '../services/authApi';

const TOKEN_STORAGE_KEY = 'kidssafe_adult_token';

export function useAdultAuth() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Validiere Token beim Start
  useEffect(() => {
    let isMounted = true;

    async function validateToken() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(storedToken);
        if (isMounted) {
          setUser(currentUser);
          setToken(storedToken);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    validateToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<AuthResponseDTO> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginAdult(payload);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<AuthResponseDTO> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerAdult(payload);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrierung fehlgeschlagen';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
