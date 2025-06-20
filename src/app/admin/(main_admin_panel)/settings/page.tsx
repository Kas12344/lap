
import CredentialsForm from '@/components/admin/CredentialsForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ADMIN_USERNAME } from '@/lib/constants';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Change Credentials</CardTitle>
          <CardDescription>
            Update your admin username and password. 
            Currently logged in as: <span className="font-semibold">{ADMIN_USERNAME}</span>.
            <br />
            <span className="text-sm text-muted-foreground">
              Note: In this prototype, password/username changes are simulated and will not persist after server restart.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialsForm currentUsername={ADMIN_USERNAME} />
        </CardContent>
      </Card>
    </div>
  );
}
