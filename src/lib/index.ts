// NOTE: 'use' router primitives can be only used inside a Route
import { action, query, redirect } from "@solidjs/router";
import prisma from "~/lib/prisma";

type Vote = "like" | "dislike";

export const registerItem = action(async (formData: FormData) => {
  "use server";
  const content = formData.get("content") as string;
  // TODO: not very clean
  const parent_id = (formData.get("parent_id") || undefined) as
    | string
    | undefined;

  if (!content) throw new Error("Missing content");
  return prisma.item.create({
    data: { parent_id: Number(parent_id), content },
  });

  // TODO: redirect
}, "registerItem");

type GetItemOpts = {
  parent_id?: number | string | null;
  searchParams?: string;
};

export const getItems = query(async (opts: GetItemOpts) => {
  "use server";

  const { parent_id, searchParams: searchParamsString } = opts;
  const searchParams = new URLSearchParams(searchParamsString);

  const skip = searchParams.get("skip") || "0";
  const take = searchParams.get("take") || "100";
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

  const fullQuery = {
    ...baseQuery,
    include: { comments: true },
    skip: Number(skip),
    take: Number(take),
    orderBy: [{ [sort]: order }],
  };

  const items = await prisma.item.findMany(fullQuery);
  const total = await prisma.item.count(baseQuery);

  return { skip, take, total, items };
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
