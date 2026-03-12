import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getProjectUsers } from '../api/roles';
import type { Role } from '../api/roles';

export const usePermissions = (projectId?: number) => {
  const { user } = useAuthStore();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !user) {
      setUserRole(null);
      return;
    }

    let isMounted = true;

    const fetchRole = async () => {
      setLoading(true);
      try {
        const roles = await getProjectUsers(projectId);
        const currentUserRole = roles.find((r) => r.user_id === user.id);

        if (isMounted && currentUserRole && currentUserRole.role) {
          setUserRole(currentUserRole.role);
        } else if (isMounted) {
          setUserRole(null);
        }
      } catch (err) {
        console.error('Failed to fetch user role for project', err);
        if (isMounted) setUserRole(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [projectId, user]);

  const hasPermission = (permission: keyof Role['permissions']): boolean => {
    if (!userRole || !userRole.permissions) return false;
    return !!userRole.permissions[permission];
  };

  return {
    userRole,
    loading,
    hasPermission,
    canManageUsers: hasPermission('can_manage_users'),
    canManageRoles: hasPermission('can_manage_roles'),
    canEditProject: hasPermission('can_edit_project'),
    canReadDocuments: hasPermission('can_read_documents'),
    canEditDocuments: hasPermission('can_edit_documents'),
    canSignDocuments: hasPermission('can_sign_documents'),
    canApproveDocuments: hasPermission('can_approve_documents'),
  };
};
