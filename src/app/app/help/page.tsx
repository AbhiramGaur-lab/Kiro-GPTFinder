import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function HelpPage() {
  return (
    <DashboardShell role={UserRole.VENDOR}>
      <div className="card">
        <h2>Help & Support</h2>
        <p>Contact support@example.com for assistance. Status page available at /status.</p>
      </div>
    </DashboardShell>
  );
}
