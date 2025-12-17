import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function SettingsPage() {
  return (
    <DashboardShell role={UserRole.SUPER_ADMIN}>
      <div className="card">
        <h2>Settings</h2>
        <p>Manage CSP allowed domains, branding, and Zoho iframe allowlist.</p>
      </div>
    </DashboardShell>
  );
}
