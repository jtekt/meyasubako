import z from "zod";

export const ModerationCategoryKeys = z.enum([
  "hate",
  "hate/threatening",
  "harassment",
  "harassment/threatening",
  "self_harm",
  "self_harm/intent",
  "self_harm/instructions",
  "sexual",
  "sexual/minors",
  "violence",
  "violence/graphic",
  "illicit",
  "illicit/violent",
]);

export const ModerationSchema = z.object({
  flagged: z.boolean(),
  categories: z.record(ModerationCategoryKeys, z.boolean()).optional(),
});
