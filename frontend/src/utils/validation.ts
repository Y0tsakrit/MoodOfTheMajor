import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  faculty: z.string().min(2, 'Faculty must be at least 2 characters'),
  major: z.string().min(2, 'Major must be at least 2 characters'),
  yearOfStudy: z.number().min(1, 'Year of study must be a positive number').max(8, 'Year of study must be less than or equal to 8'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});