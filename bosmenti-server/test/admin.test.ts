import { existsSync } from 'node:fs'
import path from 'node:path'
import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { ADMIN, close, order, setup } from './helpers.js'

let ctx: Awaited<ReturnType<typeof setup>>
beforeEach(async () => {
  if (ctx) await close(ctx.db)
  ctx = await setup()
})
afterAll(() => close(ctx.db))

const loggedIn = async () => {
  const agent = request.agent(ctx.app)
  await agent.post('/api/admin/login').send(ADMIN).expect(200)
  return agent
}

const product = (over: Record<string, unknown> = {}) => ({
  cat: 'futbolka',
  name: 'Polo futbolka',
  price: 199000,
  type: 'tee',
  colors: [{ n: 'Oq', c: '#F4F4F0' }],
  sz: 'top',
  ...over,
})

describe('admin login', () => {
  it('keeps the admin API closed without a session', async () => {
    await request(ctx.app).get('/api/admin/orders').expect(401)
    await request(ctx.app).post('/api/admin/products').send(product()).expect(401)
  })

  it('accepts only the configured login and password, and logging out ends the session', async () => {
    await request(ctx.app).post('/api/admin/login').send({ ...ADMIN, password: 'wrong' }).expect(401)
    const agent = request.agent(ctx.app)
    const res = await agent.post('/api/admin/login').send(ADMIN).expect(200)
    expect(res.headers['set-cookie'][0]).toMatch(/bos_admin=.+HttpOnly.+SameSite=Strict/)
    await agent.get('/api/admin/me').expect(200, { login: 'admin' })
    await agent.post('/api/admin/logout').expect(200)
    await agent.get('/api/admin/me').expect(401)
  })
})

describe('admin orders', () => {
  it('lists orders with counts, changes status, and the customer sees it', async () => {
    const placed = await request(ctx.app).post('/api/orders').send(order()).expect(201)
    const agent = await loggedIn()
    const list = await agent.get('/api/admin/orders').expect(200)
    expect(list.body.counts).toEqual({ new: 1 })
    expect(list.body.orders[0]).toMatchObject({ no: placed.body.no, name: 'Aziz', items: [{ name: 'Basic futbolka' }] })

    await agent.patch(`/api/admin/orders/${placed.body.no}`).send({ status: 'shipping', adminNote: 'Kuryer: Bekzod' }).expect(200)
    const mine = await request(ctx.app).post('/api/orders/lookup').send({ tokens: [placed.body.token] })
    expect(mine.body.orders[0].status).toBe('shipping')
    expect(mine.body.orders[0]).not.toHaveProperty('adminNote')

    await agent.patch(`/api/admin/orders/${placed.body.no}`).send({ status: 'lost' }).expect(400)
    await agent.get('/api/admin/orders/99999').expect(404)
  })

  it('finds orders by number, phone or name', async () => {
    await request(ctx.app).post('/api/orders').send(order({ name: 'Aziz', phone: '901111111' })).expect(201)
    await request(ctx.app).post('/api/orders').send(order({ name: 'Sardor', phone: '932222222' })).expect(201)
    const agent = await loggedIn()
    const find = async (q: string) => (await agent.get('/api/admin/orders').query({ q })).body.orders.map((o: { name: string }) => o.name)
    expect(await find('sard')).toEqual(['Sardor'])
    expect(await find('93 222')).toEqual(['Sardor'])
    expect(await find('10001')).toEqual(['Aziz'])
  })
})

describe('admin products', () => {
  it('creates, updates, switches off and deletes a product', async () => {
    const agent = await loggedIn()
    const created = await agent.post('/api/admin/products').send(product()).expect(201)
    expect(created.body.id).toMatch(/^polo-futbolka-[0-9a-f]{6}$/)

    let catalog = await request(ctx.app).get('/api/catalog')
    expect(catalog.body.products.find((p: { id: string }) => p.id === created.body.id)).toMatchObject({ price: 199000 })

    await agent.put(`/api/admin/products/${created.body.id}`).send(product({ price: 179000 })).expect(200)
    const placed = await request(ctx.app)
      .post('/api/orders')
      .send(order({ items: [{ id: created.body.id, ci: 0, size: 'L', qty: 1 }] }))
      .expect(201)
    expect(placed.body.itemsTotal).toBe(179000)

    await agent.put(`/api/admin/products/${created.body.id}`).send(product({ active: false })).expect(200)
    catalog = await request(ctx.app).get('/api/catalog')
    expect(catalog.body.products.some((p: { id: string }) => p.id === created.body.id)).toBe(false)
    const all = await agent.get('/api/admin/products').expect(200)
    expect(all.body.products.some((p: { id: string }) => p.id === created.body.id)).toBe(true)

    await agent.delete(`/api/admin/products/${created.body.id}`).expect(204)
    await agent.delete(`/api/admin/products/${created.body.id}`).expect(404)
  })

  it('rejects broken product data', async () => {
    const agent = await loggedIn()
    await agent.post('/api/admin/products').send(product({ colors: [{ n: 'Oq', c: 'white' }] })).expect(400)
    await agent.post('/api/admin/products').send(product({ imgs: ['javascript:alert(1)'] })).expect(400)
    const res = await agent.post('/api/admin/products').send(product({ cat: 'yoq' })).expect(400)
    expect(res.body.error).toBe('Bunday bo‘lim yo‘q')
  })
})

describe('admin uploads and settings', () => {
  it('stores real images and refuses other files', async () => {
    const agent = await loggedIn()
    const png = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a1c40000000049454e44ae426082', 'hex')
    const res = await agent.post('/api/admin/uploads').attach('file', png, 'photo.png').expect(201)
    expect(res.body.url).toMatch(/^\/uploads\/[\w-]+\.png$/)
    expect(existsSync(path.join(ctx.cfg.UPLOAD_DIR, path.basename(res.body.url)))).toBe(true)
    await request(ctx.app).get(res.body.url).expect(200).expect('content-type', 'image/png')

    await agent.post('/api/admin/uploads').attach('file', Buffer.from('<script>alert(1)</script>'), 'x.png').expect(400)
  })

  it('saves shop settings and shows them in the catalog', async () => {
    const agent = await loggedIn()
    const s = { phone: '+998 71 200 00 00', address: 'Toshkent, Chilonzor 5', hours: 'Har kuni 10:00–22:00', shipFee: 20000, freeFrom: 400000 }
    await agent.put('/api/admin/settings').send(s).expect(200)
    const catalog = await request(ctx.app).get('/api/catalog')
    expect(catalog.body.shop).toEqual(s)
    await agent.put('/api/admin/settings').send({ ...s, shipFee: -1 }).expect(400)
  })
})
