import { useAuthStore } from '../../store/authStore';

export const ProfileWork = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="py-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Работаю</h3>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
        <div>
          <dt className="font-medium text-gray-500">Должность:</dt>
          <dd className="mt-1 text-gray-900">{user.profile?.position || '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Компания:</dt>
          <dd className="mt-1 text-gray-900">{user.company?.name || '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Город:</dt>
          <dd className="mt-1 text-gray-900">{user.profile?.city || '—'}</dd>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 uppercase tracking-wide">
          Управление организацией
        </button>
      </div>
    </div>
  );
};
