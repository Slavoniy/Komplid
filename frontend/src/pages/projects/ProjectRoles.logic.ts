import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { getProjectUsers, assignRole, removeRole } from '../../api/roles';
import type { Role, UserProjectRole } from '../../api/roles';
import { getRoles } from '../../api/roles';

export const assignRoleSchema = z.object({
  user_id: z.number().min(1, 'ID пользователя обязательно'),
  role_id: z.number().min(1, 'Выберите роль'),
});

export type AssignRoleFormValues = z.infer<typeof assignRoleSchema>;

export const useProjectRolesLogic = (projectId: number) => {
  const [projectUsers, setProjectUsers] = useState<UserProjectRole[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersAndRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        getProjectUsers(projectId),
        getRoles()
      ]);
      setProjectUsers(usersResponse);
      setAvailableRoles(rolesResponse);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных ролей');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  const handleAssignRole = async (data: AssignRoleFormValues) => {
    setLoading(true);
    try {
      await assignRole({
        project_id: projectId,
        user_id: data.user_id,
        role_id: data.role_id
      });
      await fetchUsersAndRoles(); // refresh list
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка назначения роли');
      setLoading(false);
      throw err;
    }
  };

  const handleRemoveRole = async (assignmentId: number) => {
    if (window.confirm('Вы уверены, что хотите убрать этого пользователя из проекта?')) {
      setLoading(true);
      try {
        await removeRole(assignmentId);
        await fetchUsersAndRoles(); // refresh list
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления роли');
        setLoading(false);
      }
    }
  };

  return {
    projectUsers,
    availableRoles,
    loading,
    error,
    handleAssignRole,
    handleRemoveRole
  };
};
