import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function AuditPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Audit Logs</h2>
        <p>Append-only audit trail for administrative actions.</p>
      </div>
    </DashboardShell>
  );
}
