import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function SuperAdminsPage() {
  return (
    <DashboardShell role={UserRole.SUPER_ADMIN}>
      <div className="card">
        <h2>Admins</h2>
        <p>Manage administrator accounts, reset passwords, and disable access.</p>
      </div>
    </DashboardShell>
  );
}
