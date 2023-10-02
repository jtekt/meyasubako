import { prisma } from "../prismaClient"

const include = {
  comments: true,
}

export const createItem = async ({ body }: any) => {
  const { content, parent_id } = body
  const data = { content, parent_id }
  return prisma.item.create({ data })
}

export const readItems = async ({ query }: any) => {
  const { skip = 0, take = 100, sort = "likes", order = "desc" } = query

  const prismaQuery = {
    where: {
      parent_id: null,
    },
  }

  const fullQuery = {
    ...prismaQuery,
    include,
    skip: Number(skip),
    take: Number(take),
    orderBy: [{ [sort]: order }],
  }

  const items = await prisma.item.findMany(fullQuery)
  const total = await prisma.item.count(prismaQuery)

  return { skip, take, total, items }
}

export const readItem = async ({ params: { id } }: any) => {
  const query = {
    where: {
      id: Number(id),
    },
    include,
  }
  return prisma.item.findUnique(query)
}

export const vote =
  (increment: number) =>
  async ({ params: { id } }: any) => {
    const query = {
      where: {
        id: Number(id),
      },
      data: { likes: { increment } },
    }
    return prisma.item.update(query)
  }
