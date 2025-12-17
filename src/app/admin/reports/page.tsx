import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function ReportsAdminPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Reports Catalog</h2>
        <p>CRUD for reports with Zoho public embed URLs.</p>
      </div>
    </DashboardShell>
  );
}
