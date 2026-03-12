import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectsLogic, projectSchema } from './Projects.logic';
import type { ProjectFormValues } from './Projects.logic';
import type { Company } from '../../api/companies';
import { ProjectRoles } from './ProjectRoles';

export const Projects: React.FC = () => {
  const {
    projects,
    companies,
    loading,
    isModalOpen,
    editingProject,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete
  } = useProjectsLogic();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Проекты (Объекты строительства)</h1>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Добавить проект
          </button>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6 justify-between hover:bg-gray-50">
                    <div className="flex flex-col flex-1 cursor-pointer" onClick={() => setSelectedProjectId(project.id)}>
                      <p className="text-sm font-medium text-blue-600 truncate">{project.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Адрес: {project.address || 'Нет'}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => setSelectedProjectId(project.id)}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        Роли
                      </button>
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {projects.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">Нет добавленных проектов</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedProjectId && (
        <ProjectRoles projectId={selectedProjectId} />
      )}

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingProject ? {
            name: editingProject.name,
            address: editingProject.address,
            company_id: editingProject.company_id,
            general_contractor_id: editingProject.general_contractor_id
          } : undefined}
          companies={companies}
        />
      )}
    </div>
  );
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  initialData?: ProjectFormValues;
  companies: Company[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, onSubmit, initialData, companies }) => {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || { name: '', address: '', company_id: undefined, general_contractor_id: undefined }
  });

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {initialData ? 'Редактировать проект' : 'Новый проект'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название *</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Адрес</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Компания (Застройщик) *</label>
                  <Controller
                    name="company_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="" disabled>Выберите компанию</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Генподрядчик</label>
                  <Controller
                    name="general_contractor_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Нет (или выбрать...)</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-300"
              >
                Сохранить
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
