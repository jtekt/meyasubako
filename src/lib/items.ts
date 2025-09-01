// NOTE: 'use' router primitives can be only used inside a Route
import { action, query, redirect } from "@solidjs/router";
import prisma from "~/lib/prisma";
import { authEnabled, oidcIdentifier } from "./config";
import { useUserSession } from "@moreillon/solidstart-oidc";
import { moderateContent } from "./moderation";

type Vote = "like" | "dislike";

export const pageSize = 10;

export const registerItem = action(async (formData: FormData) => {
  "use server";

  let user_id: string | undefined = undefined;
  if (authEnabled) {
    const userSession = await useUserSession();
    user_id = userSession.data.user[oidcIdentifier];
  }

  // TODO: not very clean
  const content = formData.get("content") as string | null;
  const parent_id = formData.get("parent_id");

  if (!content) throw new Error("Missing content");

  // ADD MODERATE CONTENT
  const moderation = await moderateContent(content);
  console.warn("Moderation result:", moderation);
  if (moderation.decision === "flag") {
    const data: { content: string; user_id?: string; categories?: string } = {
      content,
      user_id,
      categories: moderation.categories.join(", "),
    };
    await prisma.flagged.create({ data });
    throw new Error(
      `Content flagged by moderation: ${moderation.explanation} (categories: ${moderation.categories.join(", ")})`
    );
  }

  // TODO: typing should be infered from Prisma schema
  const data: { content: string; parent_id?: number; user_id?: string } = {
    content,
    user_id,
  };
  if (parent_id) data.parent_id = Number(parent_id);

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
