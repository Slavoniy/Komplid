import React from 'react';
import { useRegisterLogic } from './Register.logic';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Register = () => {
  const { form, onSubmit, isLoading, errorMsg } = useRegisterLogic();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Регистрация в ConstructionDocs
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Имя</label>
              <input type="text" {...form.register('first_name')} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6" />
              {form.formState.errors.first_name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Фамилия</label>
              <input type="text" {...form.register('last_name')} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Компания</label>
            <input type="text" {...form.register('company_name')} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6" />
            {form.formState.errors.company_name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.company_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Телефон</label>
            <input type="text" {...form.register('phone')} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6" />
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <input type="email" {...form.register('email')} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6" />
            {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
            <input type="password" {...form.register('password')} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6" />
            {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
          </div>

          {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}

          <button
            type="submit" disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Уже есть аккаунт? <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Войти</Link>
        </p>
      </div>
    </div>
  );
};
