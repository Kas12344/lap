
'use server';

import { z } from 'zod';
import { ADMIN_PASSWORD } from '@/lib/constants';

const credentialsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newUsername: z.string().optional(), // Username change is optional
  newPassword: z.string().min(6, "New password must be at least 6 characters long.").optional().or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
})
.refine(data => {
  // Only validate confirmNewPassword if newPassword is provided
  if (data.newPassword && data.newPassword !== '') {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "New passwords do not match.",
  path: ["confirmNewPassword"], // Point error to the confirmation field
})
.refine(data => {
    // If newUsername is provided, it must not be empty
    if (data.newUsername !== undefined && data.newUsername.trim() === '') {
        return false;
    }
    return true;
}, {
    message: "New username cannot be empty if you intend to change it.",
    path: ["newUsername"],
})
.refine(data => {
    // If newPassword is provided, newUsername must also be provided or no changes are made
    if (data.newPassword && data.newPassword !== '' && (!data.newUsername || data.newUsername.trim() === '')) {
      // This case isn't explicitly handled by just saying "username would be updated" for simulation.
      // For a real app, you'd decide if password can be changed without username or vice-versa.
      // For simulation, we'll allow password change without username change if newUsername field is empty/not touched.
    }
    return true; 
});


export interface ChangeCredentialsState {
  success?: boolean;
  message?: string;
  errors?: {
    currentPassword?: string[];
    newUsername?: string[];
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[]; // For general form errors
  };
}

export async function handleChangeCredentials(
  prevState: ChangeCredentialsState | undefined,
  formData: FormData
): Promise<ChangeCredentialsState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = credentialsSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newUsername, newPassword } = validatedFields.data;

  if (currentPassword !== ADMIN_PASSWORD) {
    return {
      success: false,
      message: "Incorrect current password.",
      errors: { currentPassword: ["Incorrect current password."] }
    };
  }
  
  // Check if any change is actually being made
  const usernameToChange = newUsername && newUsername.trim() !== '';
  const passwordToChange = newPassword && newPassword.trim() !== '';

  if (!usernameToChange && !passwordToChange) {
    return {
      success: false,
      message: "No changes requested. Please provide a new username or password if you wish to update.",
      errors: { _form: ["No changes requested."] }
    };
  }
  
  let responseMessage = "Credentials validated. ";
  if (usernameToChange) {
    responseMessage += `Username would be updated to "${newUsername}". `;
  }
  if (passwordToChange) {
    responseMessage += "Password would be updated. ";
  }
  responseMessage += "In a real application with a database, these changes would now be saved.";

  return {
    success: true,
    message: responseMessage,
  };
}
