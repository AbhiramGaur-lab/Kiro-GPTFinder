import Link from 'next/link';
import { UserRole } from '@prisma/client';

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  return (
    <div className="main-shell">
      <aside className="sidebar">
        <h2>Portal</h2>
        <nav>
          <ul>
            <li><Link href="/app">Dashboard</Link></li>
            <li><Link href="/app/reports">Reports</Link></li>
            <li><Link href="/app/profile">Profile</Link></li>
            <li><Link href="/app/help">Help</Link></li>
            {(role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) && (
              <>
                <li><Link href="/admin">Admin Overview</Link></li>
                <li><Link href="/admin/approvals">Approvals</Link></li>
                <li><Link href="/admin/vendors">Vendors</Link></li>
                <li><Link href="/admin/users">Users</Link></li>
                <li><Link href="/admin/reports">Reports</Link></li>
                <li><Link href="/admin/assignments">Assignments</Link></li>
                <li><Link href="/admin/logs">Logs</Link></li>
                <li><Link href="/admin/audit">Audit</Link></li>
              </>
            )}
            {role === UserRole.SUPER_ADMIN && (
              <>
                <li><Link href="/superadmin/admins">Admins</Link></li>
                <li><Link href="/superadmin/plans">Plans</Link></li>
                <li><Link href="/superadmin/settings">Settings</Link></li>
                <li><Link href="/superadmin/audit">Global Audit</Link></li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
