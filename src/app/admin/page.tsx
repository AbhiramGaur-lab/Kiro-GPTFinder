import { DashboardShell } from '../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function AdminOverview() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Admin Overview</h2>
        <p>KPIs, pending approvals, and over-limit warnings.</p>
      </div>
    </DashboardShell>
  );
}
