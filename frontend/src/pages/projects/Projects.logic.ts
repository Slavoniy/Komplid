import { z } from 'zod';
import { useDataStore } from '../../store/dataStore';
import { useState, useEffect } from 'react';
import type { Project } from '../../api/projects';

export const projectSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  address: z.string().optional(),
  company_id: z.number().min(1, 'Выберите компанию'),
  general_contractor_id: z.number().optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const useProjectsLogic = () => {
  const { projects, companies, loading, fetchProjects, fetchCompanies, addProject, editProject, removeProject } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchCompanies();
  }, [fetchProjects, fetchCompanies]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (data: ProjectFormValues) => {
    const payload = {
      ...data,
      general_contractor_id: data.general_contractor_id || undefined,
    };
    if (editingProject) {
      await editProject(editingProject.id, payload);
    } else {
      await addProject(payload);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить проект?')) {
      await removeProject(id);
    }
  };

  return {
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
  };
};
