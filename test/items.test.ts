import { expect, test } from "bun:test"
import { ELYSIA_PORT } from "../src/index"

const baseUrl = `http://localhost:${ELYSIA_PORT}`

let id: number

test("POST /items", async () => {
  const options = {
    method: "POST",
    body: JSON.stringify({ content: "test" }),
    headers: { "Content-Type": "application/json" },
  }
  const response = await fetch(`${baseUrl}/items`, options)
  const data = await response.json()
  id = data.id
  expect(response.status).toBe(200)
})

test("GET /items", async () => {
  const response = await fetch(`${baseUrl}/items`)
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data.total).toBeGreaterThan(0)
})

test("GET /items/:id", async () => {
  const response = await fetch(`${baseUrl}/items/${id}`)
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data.content).toBe("test")
})

test("POST /items/:id/likes", async () => {
  const options = {
    method: "POST",
  }
  const response = await fetch(`${baseUrl}/items/${id}/likes`, options)
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data.likes).toBeGreaterThan(0)
})
