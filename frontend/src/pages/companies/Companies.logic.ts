import { z } from 'zod';
import { useDataStore } from '../../store/dataStore';
import { useState, useEffect } from 'react';
import type { Company } from '../../api/companies';

export const companySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  inn: z.string().optional(),
  ogrn: z.string().optional(),
  sro_build: z.string().optional(),
  sro_project: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export const useCompaniesLogic = () => {
  const { companies, loading, fetchCompanies, addCompany, editCompany, removeCompany } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleSubmit = async (data: CompanyFormValues) => {
    if (editingCompany) {
      await editCompany(editingCompany.id, data);
    } else {
      await addCompany(data);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить компанию?')) {
      await removeCompany(id);
    }
  };

  return {
    companies,
    loading,
    isModalOpen,
    editingCompany,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete
  };
};
