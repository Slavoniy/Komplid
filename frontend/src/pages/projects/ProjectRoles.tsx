import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectRolesLogic, assignRoleSchema } from './ProjectRoles.logic';
import type { AssignRoleFormValues } from './ProjectRoles.logic';

interface ProjectRolesProps {
  projectId: number;
}

export const ProjectRoles: React.FC<ProjectRolesProps> = ({ projectId }) => {
  const {
    projectUsers,
    availableRoles,
    loading,
    error,
    handleAssignRole,
    handleRemoveRole
  } = useProjectRolesLogic(projectId);

  const [isAssigning, setIsAssigning] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AssignRoleFormValues>({
    resolver: zodResolver(assignRoleSchema),
  });

  const onSubmit = async (data: AssignRoleFormValues) => {
    await handleAssignRole(data);
    setIsAssigning(false);
    reset();
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Участники проекта
          </h3>
          <button
            onClick={() => setIsAssigning(!isAssigning)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            {isAssigning ? 'Отмена' : 'Добавить участника'}
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

        {isAssigning && (
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">ID Пользователя</label>
              <input
                type="number"
                {...register('user_id', { valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Например: 1"
              />
              {errors.user_id && <p className="mt-1 text-xs text-red-600">{errors.user_id.message}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Роль</label>
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="" disabled>Выберите роль</option>
                    {availableRoles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                )}
              />
              {errors.role_id && <p className="mt-1 text-xs text-red-600">{errors.role_id.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-1"
            >
              Назначить
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Действия</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectUsers.map((role) => (
                      <tr key={role.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {role.user ? `${role.user.first_name} ${role.user.last_name || ''}` : `User ID: ${role.user_id}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {role.user ? role.user.email : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {role.role?.name || 'Неизвестно'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveRole(role.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                    {projectUsers.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                          В проекте пока нет участников
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
