import apiClient from './client';

export interface Role {
  id: number;
  name: string;
  permissions: {
    can_manage_users?: boolean;
    can_manage_roles?: boolean;
    can_edit_project?: boolean;
    can_read_documents?: boolean;
    can_edit_documents?: boolean;
    can_sign_documents?: boolean;
    can_approve_documents?: boolean;
  };
}

export interface UserProjectRole {
  id: number;
  user_id: number;
  project_id: number;
  role_id: number;
  role?: Role;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name?: string;
  };
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get('/api/roles/');
  return response.data;
};

export const getProjectUsers = async (projectId: number): Promise<UserProjectRole[]> => {
  const response = await apiClient.get(`/api/roles/project/${projectId}`);
  return response.data;
};

export const assignRole = async (data: { user_id: number; project_id: number; role_id: number }): Promise<UserProjectRole> => {
  const response = await apiClient.post('/api/roles/assign', data);
  return response.data;
};

export const removeRole = async (assignmentId: number): Promise<void> => {
  await apiClient.delete(`/api/roles/remove/${assignmentId}`);
};
