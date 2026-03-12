import apiClient from './client';
import type { Company } from './companies';

export interface Project {
  id: number;
  name: string;
  address?: string;
  company_id: number;
  general_contractor_id?: number;
  general_contractor?: Company;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get('/api/projects/');
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await apiClient.get(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (data: Omit<Project, 'id' | 'general_contractor'>): Promise<Project> => {
  const response = await apiClient.post('/api/projects/', data);
  return response.data;
};

export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const response = await apiClient.put(`/api/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/projects/${id}`);
};
