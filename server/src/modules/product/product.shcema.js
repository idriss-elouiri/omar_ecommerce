import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title must be at least 1 character long"),
  content: z
    .string({ required_error: "Content is required" })
    .min(10, "Content must be at least 10 characters long"),
  price: z
    .number({ required_error: "Price is required" })
    .min(0, "Price must be a positive number"),
  category: z.string({ required_error: "Category is required" }),
  images: z
    .array(z.string(), { required_error: "Images are required" })
    .nonempty("Images array cannot be empty"),
});
