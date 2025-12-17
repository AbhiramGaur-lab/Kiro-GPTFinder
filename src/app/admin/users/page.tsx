import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function UsersPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Users</h2>
        <p>Manage vendor users, invites, and statuses.</p>
      </div>
    </DashboardShell>
  );
}
