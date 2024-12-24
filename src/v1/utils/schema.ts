import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const signUpSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Password do not match",
            });
        }
    });

export type SignInValue = z.infer<typeof signInSchema>;
export type SignUpValue = z.infer<typeof signUpSchema>;
