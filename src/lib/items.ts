// NOTE: 'use' router primitives can be only used inside a Route
import { action, query, redirect } from "@solidjs/router";
import prisma from "~/lib/prisma";
import { aiEnabled, authEnabled, oidcIdentifier } from "./config";
import { useUserSession } from "@moreillon/solidstart-oidc";
import { Prisma } from "../../generated/prisma/client";
import OpenAI from "openai";
import { ModerationSchema } from "~/schemas/moderation";

type Vote = "like" | "dislike";

export const pageSize = 10;

export const registerItem = action(async (formData: FormData) => {
  "use server";
  let user_id: string | undefined = undefined;
  if (authEnabled) {
    const userSession = await useUserSession();
    user_id = userSession.data.user[oidcIdentifier];
  }

  const content = formData.get("content") as string | null;
  const parent_id = formData.get("parent_id");

  if (!content) throw new Error("Missing content");

  if (aiEnabled) {
    try {
      const client = new OpenAI();

      const customInstructions = process.env.MODERATION_INSTRUCTIONS;
      console.log("Using custom instructions:", !!customInstructions);

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
${customInstructions || "None"}

CONTENT TO ANALYZE:
"${content}"

Respond ONLY with a JSON object in this exact format:
{
  "flagged": boolean,
  "categories": {
    "category_name": boolean
  }
}

Only include categories that are flagged (true). If no violations, return empty categories object.`;

      const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini", // or "gpt-4o" for better accuracy
        messages: [
          {
            role: "system",
            content:
              "You are a precise content moderation system. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: moderationPrompt,
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
        throw new Error("No moderation result received");
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(moderationResult);
      } catch (parseError) {
        console.error("Failed to parse moderation result:", moderationResult);
        throw new Error("Invalid moderation response format");
      }
      const validatedResult = ModerationSchema.parse(parsedResult);

      if (validatedResult.flagged) {
        console.log("Content flagged:", validatedResult);
        return {
          error: true,
          categories: validatedResult.categories,
        };
      }
    } catch (error) {
      console.error("Moderation error:", error);
      throw new Error("Content moderation failed: " + (error as Error).message);
    }
  }

  const data: Prisma.itemCreateInput = {
    content,
    user_id,
  };
  if (parent_id) data.parent = { connect: { id: Number(parent_id) } };
  const newItem = await prisma.item.create({ data });
  throw redirect(`/items/${newItem.id}`);
}, "registerItem");

type GetItemOpts = {
  parent_id?: number | string | null;
  searchParams?: string;
};

export const getItems = query(async (opts: GetItemOpts) => {
  "use server";

  const { parent_id, searchParams: searchParamsString } = opts;
  const searchParams = new URLSearchParams(searchParamsString);

  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "time";
  const order = searchParams.get("order") || "desc";
  const search = searchParams.get("search");

  const baseQuery: any = {
    where: {
      likes: {
        gte: -5,
      },
    },
  };

  if (parent_id) baseQuery.where.parent_id = Number(parent_id);
  else baseQuery.where.parent_id = null;
  if (search)
    baseQuery.where.content = { contains: search, mode: "insensitive" };

  const skip = (Number(page) - 1) * Number(pageSize);

  const fullQuery = {
    ...baseQuery,
    include: { comments: true },
    skip,
    take: Number(pageSize),
    orderBy: [{ [sort]: order }],
  };

  const items = await prisma.item.findMany(fullQuery);
  const total = await prisma.item.count(baseQuery);

  return { page: Number(page), pageSize, total, items };
}, "items");

function includeParents(layer = 0): any {
  // Get parents recursively
  layer++;
  const max_layer = 50;
  return {
    include: {
      parent: layer < max_layer ? includeParents(layer) : false,
    },
  };
}

export const getItem = query(async (id: number | string) => {
  "use server";
  const query = {
    where: { id: Number(id) },
    ...includeParents(),
  };
  return await prisma.item.findUnique(query);
}, "item");

export const registerVote = action(async (id: number, vote: Vote) => {
  "use server";
  const voteMap = {
    like: 1,
    dislike: -1,
  };

  const increment = voteMap[vote];

  return prisma.item.update({
    where: { id },
    data: { likes: { increment } },
  });
}, "vote");
