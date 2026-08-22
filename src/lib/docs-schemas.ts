import { z } from 'zod';

export const createDocSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});
export type CreateDocInput = z.infer<typeof createDocSchema>;

export const inviteCollaboratorSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});
export type InviteCollaboratorInput = z.infer<typeof inviteCollaboratorSchema>;
