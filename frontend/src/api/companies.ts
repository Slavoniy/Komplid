import apiClient from './client';

export interface Company {
  id: number;
  name: string;
  inn?: string;
  ogrn?: string;
  sro_build?: string;
  sro_project?: string;
}

export const getCompanies = async (): Promise<Company[]> => {
  const response = await apiClient.get('/api/companies/');
  return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
  const response = await apiClient.get(`/api/companies/${id}`);
  return response.data;
};

export const createCompany = async (data: Omit<Company, 'id'>): Promise<Company> => {
  const response = await apiClient.post('/api/companies/', data);
  return response.data;
};

export const updateCompany = async (id: number, data: Partial<Company>): Promise<Company> => {
  const response = await apiClient.put(`/api/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/companies/${id}`);
};
