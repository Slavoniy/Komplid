import { create } from 'zustand';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../api/companies';
import type { Company } from '../api/companies';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';
import type { Project } from '../api/projects';

interface DataState {
  companies: Company[];
  projects: Project[];
  loading: boolean;
  error: string | null;

  fetchCompanies: () => Promise<void>;
  addCompany: (data: Omit<Company, 'id'>) => Promise<Company>;
  editCompany: (id: number, data: Partial<Company>) => Promise<Company>;
  removeCompany: (id: number) => Promise<void>;

  fetchProjects: () => Promise<void>;
  addProject: (data: Omit<Project, 'id' | 'general_contractor'>) => Promise<Project>;
  editProject: (id: number, data: Partial<Project>) => Promise<Project>;
  removeProject: (id: number) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  companies: [],
  projects: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const companies = await getCompanies();
      set({ companies, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки компаний', loading: false });
    }
  },

  addCompany: async (data) => {
    set({ loading: true, error: null });
    try {
      const newCompany = await createCompany(data);
      set({ companies: [...get().companies, newCompany], loading: false });
      return newCompany;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Ошибка создания компании', loading: false });
      throw err;
    }
  },

  editCompany: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedCompany = await updateCompany(id, data);
      set({
        companies: get().companies.map(c => c.id === id ? updatedCompany : c),
        loading: false
      });
      return updatedCompany;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Ошибка обновления компании', loading: false });
      throw err;
    }
  },

  removeCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCompany(id);
      set({
        companies: get().companies.filter(c => c.id !== id),
        loading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка удаления компании', loading: false });
      throw err;
    }
  },

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await getProjects();
      set({ projects, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки проектов', loading: false });
    }
  },

  addProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const newProject = await createProject(data);
      set({ projects: [...get().projects, newProject], loading: false });
      return newProject;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Ошибка создания проекта', loading: false });
      throw err;
    }
  },

  editProject: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedProject = await updateProject(id, data);
      set({
        projects: get().projects.map(p => p.id === id ? updatedProject : p),
        loading: false
      });
      return updatedProject;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Ошибка обновления проекта', loading: false });
      throw err;
    }
  },

  removeProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProject(id);
      set({
        projects: get().projects.filter(p => p.id !== id),
        loading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка удаления проекта', loading: false });
      throw err;
    }
  }
}));
