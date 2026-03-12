import { useAuthStore } from '../../store/authStore';

export const ProfileHeader = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-gray-200">
      {/* Аватар */}
      <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
        {user.profile?.avatar_url ? (
          <img src={user.profile.avatar_url} alt="Аватар" className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-500 text-2xl font-bold">
            {user.first_name[0]}{user.last_name?.[0]}
          </span>
        )}
      </div>

      {/* Основная инфа */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Роль: Администратор системы {/* В будущем будет браться из user.roles */}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-500">Эл. почта:</span>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Моб. телефон:</span>
            <p className="text-gray-900">{user.profile?.phone || '—'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">НРС:</span>
            <p className="text-gray-900">{user.profile?.nrs_number || '—'}</p>
          </div>
        </div>
      </div>

      <div>
        <button
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 uppercase tracking-wide"
        >
          Редактировать
        </button>
      </div>
    </div>
  );
};
