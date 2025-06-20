
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { handleChangeCredentials, type ChangeCredentialsState } from '@/app/admin/(main_admin_panel)/settings/actions'; // Adjusted import path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CredentialsFormProps {
  currentUsername: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Update Credentials
    </Button>
  );
}

export default function CredentialsForm({ currentUsername }: CredentialsFormProps) {
  const initialState: ChangeCredentialsState | undefined = undefined;
  const [state, formAction] = useFormState(handleChangeCredentials, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === true && state.message) {
      toast({
        title: "Success (Simulated)",
        description: state.message,
        variant: "default",
      });
    } else if (state?.success === false && state.message && !state.errors) { // General form error without field specifics
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      {state?.success === false && state.message && state.errors?._form && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Update Failed</AlertTitle>
          <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
        </Alert>
      )}
       {state?.success === true && state.message && (
        <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success (Simulated)</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
        />
        {state?.errors?.currentPassword && (
          <p className="text-sm text-destructive">{state.errors.currentPassword.join(', ')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newUsername">New Username (Optional)</Label>
        <Input
          id="newUsername"
          name="newUsername"
          type="text"
          placeholder={currentUsername}
        />
        <p className="text-xs text-muted-foreground">Leave blank to keep current username ({currentUsername}).</p>
        {state?.errors?.newUsername && (
          <p className="text-sm text-destructive">{state.errors.newUsername.join(', ')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password (Optional)</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
        />
         <p className="text-xs text-muted-foreground">Leave blank if you do not want to change the password.</p>
        {state?.errors?.newPassword && (
          <p className="text-sm text-destructive">{state.errors.newPassword.join(', ')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
        />
        {state?.errors?.confirmNewPassword && (
          <p className="text-sm text-destructive">{state.errors.confirmNewPassword.join(', ')}</p>
        )}
      </div>
      
      <SubmitButton />
    </form>
  );
}
