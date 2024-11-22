'use server'

import { z } from 'zod';

const registerSchema = z
    .object({
        givenName: z
            .string({ invalid_type_error: 'Please enter a valid first name', message: 'Please enter a valid first name' })
            .min(2, { message: 'First name must be at least 2 characters long' }),
        familyName: z
            .string({ invalid_type_error: 'Please enter a valid last name', message: 'Please enter a valid last name' })
            .min(2, { message: 'Last name must be at least 2 characters long' }),
        email: z
            .string({ invalid_type_error: 'Please enter a valid email', message: 'Please enter a valid email' })
            .email({ message: 'Please enter a valid email' }),
        password: z
            .string({ invalid_type_error: 'Please enter a valid password', message: 'Please enter a valid password' })
            .min(8, { message: 'Password must be at least 8 characters long' }),
            // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            //     message: 'Password must contain at least one number, one special character, and one uppercase letter',
            // }),
        confirmPassword: z
            .string({ invalid_type_error: 'Please enter a valid password', message: 'Please enter a valid password' })
            .min(8, { message: 'Password must be at least 8 characters long' }),
            // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            //     message: 'Password must contain at least one number, one special character, and one uppercase letter',
            // }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                path: ['confirmPassword'],
                message: 'Passwords do not match',
                code: 'custom',
            });
        }
    });


export async function validateUser(formData: FormData) {
    const validatedFields = registerSchema.safeParse({
        givenName: formData.get('givenName'),
        familyName: formData.get('familyName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        }
    }

    return {
        errors: {},
        success: true,
    }
}

