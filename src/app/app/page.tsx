import { DashboardShell } from '../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function VendorDashboard() {
  return (
    <DashboardShell role={UserRole.VENDOR}>
      <div className="card">
        <h2>Vendor Dashboard</h2>
        <p>Search and launch Zoho Analytics embeds assigned to your tenant.</p>
        <div className="badge status-active">Plan: Free</div>
      </div>
    </DashboardShell>
  );
}
