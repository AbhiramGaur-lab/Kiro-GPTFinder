import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function ApprovalsPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Pending Approvals</h2>
        <p>Approve, reject, or request more info for vendor signups.</p>
      </div>
    </DashboardShell>
  );
}
