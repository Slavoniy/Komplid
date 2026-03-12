import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

const registerSchema = z.object({
  first_name: z.string().min(2, 'Минимум 2 символа'),
  last_name: z.string().optional(),
  company_name: z.string().min(2, 'Название компании обязательно'),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  comment: z.string().optional()
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegisterLogic = () => {
  const { register: registerUser, isLoading } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg('');
    try {
      await registerUser(data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  return { form, onSubmit, isLoading, errorMsg };
};
