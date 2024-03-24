import { expect, test } from "bun:test"
import { ELYSIA_PORT } from "../src/index"

const baseUrl = `http://localhost:${ELYSIA_PORT}`

test("GET /items", async () => {
  const { status } = await fetch(`${baseUrl}/items`)
  expect(status).toBe(200)
})
