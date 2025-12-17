import { DashboardShell } from '../../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

interface Props {
  params: { id: string };
}

export default function ReportViewer({ params }: Props) {
  return (
    <DashboardShell role={UserRole.VENDOR}>
      <div className="card">
        <h2>Report {params.id}</h2>
        <p>Zoho Analytics embed with plan checks, assignment validation, and vendor scoping.</p>
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            title="Zoho report"
            src="https://analytics.zoho.com/open-view"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '0' }}
            allowFullScreen
          />
        </div>
      </div>
    </DashboardShell>
  );
}
