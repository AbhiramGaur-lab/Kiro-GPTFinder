import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function SuperAuditPage() {
  return (
    <DashboardShell role={UserRole.SUPER_ADMIN}>
      <div className="card">
        <h2>Global Audit</h2>
        <p>View all audit records across tenants with export support.</p>
      </div>
    </DashboardShell>
  );
}
