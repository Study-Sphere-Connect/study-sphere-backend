import z from 'zod'

export const CreateEducationSchema = z.object({
    body: z.object({
        institution: z.string().min(3, {
            message: "Minimum 3 characters required."
        }),
        country: z.string().min(3, {
            message: "Minimum 3 characters required."
        }),
        level: z.enum(["HIGH_SCHOOL", "BACHELOR", "MASTER", "PHD"]),
        major: z.string().min(3, {
            message: "Minimum 3 characters required."
        }),
        startYear: z.coerce.number().min(4, {
            message: "Minimum 4 characters required."
        }),
        endYear: z.coerce.number().min(4, {
            message: "Minimum 4 characters required."
        })
    })
})

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const VerifyEducationSchema = z.object({
    body: z.object({
        documentType: z.enum(["DEGREE", "TRANSCRIPT", "CERTIFICATE", "STUDENT_ID"]),
        documentUrl: z.string().url({
            message: "Invalid URL."
        }),
        // document: z.any()
        // .refine((file) => file?.name, "File is required.")
        // .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
        // .refine(
        // (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
        // "Only .pdf file is accepted."
        // ),
    })
})