import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const comparisonSchema = z.object({
<<<<<<< HEAD
  retailerNames: z.array(z.string()).min(1, 'Add at least one retailer'),
=======
  retailerIds: z.array(z.string()).min(1, 'Select at least one retailer'),
>>>>>>> 20e959abf7e5607ac3d843da2049ab58c7c9de8e
  countryId: z.string().min(1, 'Select a country'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ComparisonFormData = z.infer<typeof comparisonSchema>;


