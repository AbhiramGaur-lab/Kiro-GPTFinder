import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function VendorsPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Vendors</h2>
        <p>Manage vendor lifecycle, plan assignment, and status changes.</p>
      </div>
    </DashboardShell>
  );
}
