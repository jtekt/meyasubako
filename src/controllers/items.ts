import { prisma } from "../prismaClient"

const include = {
  comments: true,
}

const includeParents = (layer = 0): any => {
  // Get parents recursively
  layer++
  const max_layer = 50
  return {
    include: {
      parent: layer < max_layer ? includeParents(layer) : false,
    },
  }
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
    sort = "time",
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

  const fullQuery = {
    ...baseQuery,
    include,
    skip: Number(skip),
    take: Number(take),
    orderBy: [{ [sort]: order }],
  }

  const items = await prisma.item.findMany(fullQuery)
  const total = await prisma.item.count(baseQuery)

  return { skip, take, total, items }
}

export const readItem = async ({ params: { id } }: any) => {
  const query = {
    where: {
      id: Number(id),
    },
    ...includeParents(),
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
