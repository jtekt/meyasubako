// NOTE: 'use' router primitives can be only used inside a Route
import { action, query, redirect } from "@solidjs/router";
import prisma from "~/lib/prisma";
type Vote = "like" | "dislike";

export const getItems = query(
  async ({ parent_id, search }: { parent_id?: number; search: any }) => {
    "use server";

    const {
      skip = "0",
      take = "100",
      sort = "time",
      order = "desc",
      min_likes = "-5",
      // parent_id,
      // search,
    } = {};

    const baseQuery: any = {
      where: {
        likes: {
          gte: Number(min_likes),
        },
      },
    };

    if (parent_id) baseQuery.where.parent_id = parent_id;
    else baseQuery.where.parent_id = null;

    //   if (search)
    //     baseQuery.where.content = { contains: search, mode: "insensitive" }

    const fullQuery = {
      ...baseQuery,
      // include: { comments: true },
      skip: Number(skip),
      take: Number(take),
      orderBy: [{ [sort]: order }],
    };

    const items = await prisma.item.findMany(fullQuery);
    const total = await prisma.item.count(baseQuery);

    return { skip, take, total, items };
  },
  "items"
);

const includeParents = (layer = 0): any => {
  // Get parents recursively
  layer++;
  const max_layer = 50;
  return {
    include: {
      parent: layer < max_layer ? includeParents(layer) : false,
    },
  };
};

export const getItem = query(async (id: number) => {
  "use server";
  const query = {
    where: { id },
    ...includeParents(),
  };
  const item = await prisma.item.findUnique(query);
  return item;
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

// import {
//   getSession,
//   login,
//   logout as logoutSession,
//   register,
//   validatePassword,
//   validateUsername
// } from "./server";

// export const getUser = query(async () => {
//   "use server";
//   try {
//     const session = await getSession();
//     const userId = session.data.userId;
//     if (userId === undefined) throw new Error("User not found");
//     const user = await db.user.findUnique({ where: { id: userId } });
//     if (!user) throw new Error("User not found");
//     return { id: user.id, username: user.username };
//   } catch {
//     await logoutSession();
//     throw redirect("/login");
//   }
// }, "user");

// export const loginOrRegister = action(async (formData: FormData) => {
//   "use server";
//   const username = String(formData.get("username"));
//   const password = String(formData.get("password"));
//   const loginType = String(formData.get("loginType"));
//   let error = validateUsername(username) || validatePassword(password);
//   if (error) return new Error(error);

//   try {
//     const user = await (loginType !== "login"
//       ? register(username, password)
//       : login(username, password));
//     const session = await getSession();
//     await session.update(d => {
//       d.userId = user.id;
//     });
//   } catch (err) {
//     return err as Error;
//   }
//   return redirect("/");
// });

// export const logout = action(async () => {
//   "use server";
//   await logoutSession();
//   return redirect("/login");
// });
