import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileWork } from '../components/profile/ProfileWork';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, fetchUser, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading && !user) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Карточка профиля */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 relative">

          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 text-sm text-red-600 hover:text-red-500 font-medium"
          >
            ВЫЙТИ
          </button>

          <ProfileHeader />
          <ProfileWork />

        </div>
      </div>
    </div>
  );
};
