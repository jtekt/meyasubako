import OpenAI from "openai";
import { aiEnabled, OPENAI_MODEL, MODERATION_INSTRUCTIONS } from "./config";
import { ModerationCategoryKeys, ModerationSchema } from "~/schemas/moderation";
import z from "zod";

export const moderateContent = async (
  message: string
): Promise<{
  error: boolean;
  categories?: Partial<Record<z.infer<typeof ModerationCategoryKeys>, boolean>>;
}> => {
  if (!aiEnabled) return { error: false };

  try {
    const client = new OpenAI();

    console.log("Using custom instructions:", !!MODERATION_INSTRUCTIONS);

    const moderationPrompt = `You are a content moderation system. Analyze the following content and determine if it violates any of these categories:

CATEGORIES TO CHECK:
- hate: Content that expresses hatred toward people based on identity
- hate/threatening: Hateful content that includes threats or incites violence
- harassment: Content meant to torment or bully an individual
- harassment/threatening: Harassment that includes threats
- self-harm: Content that promotes or encourages self-harm
- self-harm/intent: Content expressing intent to engage in self-harm
- self-harm/instructions: Instructions or methods for self-harm
- sexual: Sexual content (adjust threshold as needed)
- sexual/minors: Sexual content involving anyone under 18
- violence: Content depicting violence or celebrating violence
- violence/graphic: Graphic depictions of violence
- illicit: Content promoting illegal activities
- illicit/violent: Content promoting violent illegal activities

CUSTOM INSTRUCTIONS:
${MODERATION_INSTRUCTIONS}

Respond ONLY with a JSON object in this exact format:
{
  "flagged": boolean,
  "categories": {
    "category_name": boolean
  }
}

Only include categories that are flagged (true). If no violations, return empty categories object.`;

    const userContent = `CONTENT TO ANALYZE: "${message}"`;

    const resp = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a precise content moderation system. Always respond with valid JSON only.",
        },
        {
          role: "system",
          content: moderationPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      temperature: 0, // For consistent results
      max_tokens: 200,
      response_format: {
        type: "json_schema",

        json_schema: {
          name: "moderation_response",
          schema: {
            type: "object",
            properties: {
              flagged: { type: "boolean" },
              categories: {
                type: "object",
                properties: {
                  hate: { type: "boolean" },
                  "hate/threatening": { type: "boolean" },
                  harassment: { type: "boolean" },
                  "harassment/threatening": { type: "boolean" },
                  self_harm: { type: "boolean" },
                  "self_harm/intent": { type: "boolean" },
                  "self_harm/instructions": { type: "boolean" },
                  sexual: { type: "boolean" },
                  "sexual/minors": { type: "boolean" },
                  violence: { type: "boolean" },
                  "violence/graphic": { type: "boolean" },
                  illicit: { type: "boolean" },
                  "illicit/violent": { type: "boolean" },
                },
              },
            },
            required: ["flagged", "categories"],
          },
        },
      },
    });

    const moderationResult = resp.choices[0].message.content;

    if (!moderationResult) {
      return { error: true };
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(moderationResult);
    } catch (parseError) {
      console.error("Failed to parse moderation result:", moderationResult);

      return { error: true };
    }

    const validatedResult = ModerationSchema.parse(parsedResult);

    if (validatedResult.flagged) {
      console.log("Content flagged:", {
        message,
        validatedResult,
        time: new Date().toISOString(),
      });
      return {
        error: true,
        categories: validatedResult.categories,
      };
    }

    return { error: false };
  } catch (error) {
    console.error("Moderation error:", error);

    return { error: true };
  }
  return { error: true };
};
