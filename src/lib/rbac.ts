import { UserRole } from '@prisma/client';

export type Permission =
  | 'vendor.read_reports'
  | 'vendor.read_profile'
  | 'admin.manage_vendors'
  | 'admin.manage_users'
  | 'admin.manage_reports'
  | 'admin.manage_assignments'
  | 'admin.view_logs'
  | 'superadmin.manage_admins'
  | 'superadmin.manage_plans'
  | 'superadmin.manage_settings'
  | 'superadmin.view_audit';

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.VENDOR]: ['vendor.read_reports', 'vendor.read_profile'],
  [UserRole.ADMIN]: [
    'vendor.read_reports',
    'vendor.read_profile',
    'admin.manage_vendors',
    'admin.manage_users',
    'admin.manage_reports',
    'admin.manage_assignments',
    'admin.view_logs'
  ],
  [UserRole.SUPER_ADMIN]: [
    'vendor.read_reports',
    'vendor.read_profile',
    'admin.manage_vendors',
    'admin.manage_users',
    'admin.manage_reports',
    'admin.manage_assignments',
    'admin.view_logs',
    'superadmin.manage_admins',
    'superadmin.manage_plans',
    'superadmin.manage_settings',
    'superadmin.view_audit'
  ]
};

export function hasPermission(role: UserRole, permission: Permission) {
  return rolePermissions[role]?.includes(permission);
}
