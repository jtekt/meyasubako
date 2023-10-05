import { prisma } from "../src/prismaClient"

const url = "http://10.115.1.100:31040/monku"
const response = await fetch(url)
const items = await response.json()

const itemsFormatted = items.map((i: any) => ({
  time: i.timestamp,
  content: i.content,
  likes: i.likes,
  comments: {
    create: i.proposals.map((p: any) => ({
      time: p.timestamp,
      content: p.content,
      likes: p.likes,
    })),
  },
}))

for await (const item of itemsFormatted) {
  await prisma.item.create({ data: item })
}
