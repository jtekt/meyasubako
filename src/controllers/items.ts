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
  const {
    skip = 0,
    take = 100,
    sort = "likes",
    order = "desc",
    parent_id,
    search,
  } = query

  const baseQuery: any = {
    where: {},
  }

  if (parent_id) baseQuery.where.parent_id = Number(parent_id)
  else baseQuery.where.parent_id = null
  if (search)
    baseQuery.where.content = { contains: search, mode: "insensitive" }

  const total = await prisma.item.count(baseQuery)

  const fullQuery = {
    ...baseQuery,
    include,
    skip: Number(skip),
    take: Number(take),
    orderBy: [{ [sort]: order }],
  }

  const items = await prisma.item.findMany(fullQuery)

  return { skip, take, total, items }
}

export const readItem = async ({ params: { id } }: any) => {
  const query = {
    where: {
      id: Number(id),
    },
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
      include,
    }
    return prisma.item.update(query)
  }
