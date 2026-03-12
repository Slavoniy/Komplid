import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const useLoginLogic = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    try {
      await login(params);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Ошибка авторизации');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMsg,
    handleSubmit,
    isLoading,
    storeError: error,
  };
};
