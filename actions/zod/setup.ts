"use server"
import {z} from "zod";

const setupSchema = z.object({
    id: z
        .string({ invalid_type_error: 'No valid user ID found', message: 'No valid user ID found' }),
    role: z
        .string({ invalid_type_error: 'Please select a role', message: 'Please select a role' }),
    email: z
        .string({ invalid_type_error: 'No valid email found', message: 'No valid email found' })
        .email({ message: 'Please enter a valid email' }),
    preferences: z
        .object({
            solarScore: z.number({ invalid_type_error: 'Please enter a valid solar score', message: 'Please enter a valid solar score' }),
            roofType: z.string({ invalid_type_error: 'Please enter a valid roof type', message: 'Please enter a valid roof type' }),
            projectType: z.string({ invalid_type_error: 'Please enter a valid project type', message: 'Please enter a valid project type' }),
            price: z.number({ invalid_type_error: 'Please enter a valid price', message: 'Please enter a valid price' }),
        }),
});

export async function validateUser(formData: FormData) {
    const validatedFields = setupSchema.safeParse({
        id: formData.get('id'),
        role: formData.get('role'),
        email: formData.get('email'),
        preferences: {
            solarScore: formData.get('solarScore'),
            roofType: formData.get('roofType'),
            projectType: formData.get('projectType'),
            price: formData.get('price'),
        },
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
