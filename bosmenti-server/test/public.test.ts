import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { orderMessage } from '../src/services/telegram.js'
import { close, order, setup } from './helpers.js'

let ctx: Awaited<ReturnType<typeof setup>>
beforeEach(async () => {
  if (ctx) await close(ctx.db)
  ctx = await setup()
})
afterAll(() => close(ctx.db))

describe('GET /api/catalog', () => {
  it('returns categories, active products, sizes and shop settings', async () => {
    const res = await request(ctx.app).get('/api/catalog').expect(200)
    expect(res.body.categories).toHaveLength(11)
    expect(res.body.products).toHaveLength(28)
    expect(res.body.products[0]).toMatchObject({ id: 'oxford', cat: 'koylak', price: 289000, imgs: ['img/p-oxford.jpg', 'img/p-oxford2.jpg'] })
    expect(res.body.sizes.top).toContain('XL')
    expect(res.body.shop).toMatchObject({ shipFee: 25000, freeFrom: 500000 })
  })

  it('hides products the shop switched off', async () => {
    await ctx.db.query("UPDATE products SET is_active = false WHERE id = 'tee'")
    const res = await request(ctx.app).get('/api/catalog').expect(200)
    expect(res.body.products.map((p: { id: string }) => p.id)).not.toContain('tee')
  })
})

describe('POST /api/orders', () => {
  it('prices the order from the database and adds the delivery fee', async () => {
    const res = await request(ctx.app)
      .post('/api/orders')
      .send(order({ items: [{ id: 'tee', ci: 1, size: 'M', qty: 2, price: 1 }] }))
      .expect(201)
    expect(res.body).toMatchObject({ no: 10001, itemsTotal: 258000, shipFee: 25000, total: 283000, status: 'new', phone: '+998901234567' })
    expect(res.body.items[0]).toMatchObject({ name: 'Basic futbolka', color: 'Qora', size: 'M', qty: 2, price: 129000 })
    expect(res.body.token).toMatch(/^[\w-]{20,}$/)
    expect(res.body).not.toHaveProperty('adminNote')
    expect(ctx.sent.map(o => o.no)).toEqual([10001])
  })

  it('delivers for free above the threshold and never charges for pickup', async () => {
    const big = await request(ctx.app).post('/api/orders').send(order({ items: [{ id: 'suit1', ci: 0, size: '50', qty: 1 }] })).expect(201)
    expect(big.body).toMatchObject({ shipFee: 0, total: 1890000 })
    const pickup = await request(ctx.app).post('/api/orders').send(order({ ship: 'pickup', address: '' })).expect(201)
    expect(pickup.body).toMatchObject({ shipFee: 0, total: 258000, address: '' })
  })

  it('uses the delivery fee from the shop settings', async () => {
    await ctx.db.query(`UPDATE settings SET data = data || '{"shipFee": 30000}'`)
    const res = await request(ctx.app).post('/api/orders').send(order()).expect(201)
    expect(res.body.shipFee).toBe(30000)
  })

  it('rejects sizes, colours and products that are not on sale', async () => {
    await request(ctx.app).post('/api/orders').send(order({ items: [{ id: 'tee', ci: 0, size: '48', qty: 1 }] })).expect(409)
    await request(ctx.app).post('/api/orders').send(order({ items: [{ id: 'tee', ci: 9, size: 'M', qty: 1 }] })).expect(409)
    await request(ctx.app).post('/api/orders').send(order({ items: [{ id: 'nope', ci: 0, size: 'M', qty: 1 }] })).expect(409)
    await ctx.db.query("UPDATE products SET is_active = false WHERE id = 'tee'")
    const res = await request(ctx.app).post('/api/orders').send(order()).expect(409)
    expect(res.body.details).toMatchObject({ index: 0, id: 'tee' })
    expect((await ctx.db.query('SELECT count(*)::int AS n FROM orders')).rows[0].n).toBe(0)
  })

  it('explains what is missing', async () => {
    const noAddress = await request(ctx.app).post('/api/orders').send(order({ address: '' })).expect(400)
    expect(noAddress.body.error).toBe('Yetkazib berish manzilini kiriting')
    const badPhone = await request(ctx.app).post('/api/orders').send(order({ phone: '12345' })).expect(400)
    expect(badPhone.body.error).toMatch(/Telefon raqam/)
    await request(ctx.app).post('/api/orders').send(order({ items: [] })).expect(400)
    await request(ctx.app).post('/api/orders').send(order({ items: [{ id: 'tee', ci: 0, size: 'M', qty: 11 }] })).expect(400)
  })
})

describe('POST /api/orders/lookup', () => {
  it('returns only the orders whose secret tokens the browser holds', async () => {
    const a = await request(ctx.app).post('/api/orders').send(order()).expect(201)
    await request(ctx.app).post('/api/orders').send(order({ name: 'Boshqa' })).expect(201)
    await ctx.db.query("UPDATE orders SET status = 'confirmed', admin_note = 'ichki izoh' WHERE no = $1", [a.body.no])
    const res = await request(ctx.app).post('/api/orders/lookup').send({ tokens: [a.body.token, 'x'.repeat(24)] }).expect(200)
    expect(res.body.orders).toHaveLength(1)
    expect(res.body.orders[0]).toMatchObject({ no: a.body.no, status: 'confirmed' })
    expect(res.body.orders[0]).not.toHaveProperty('adminNote')
  })
})

describe('Telegram message', () => {
  it('lists the customer, items and total', async () => {
    const res = await request(ctx.app).post('/api/orders').send(order({ note: 'Kechqurun' })).expect(201)
    const text = orderMessage(ctx.sent[0], 'https://bosmenti.uz/')
    expect(text).toContain(`Yangi buyurtma № ${res.body.no}`)
    expect(text).toContain('Telefon: +998901234567')
    expect(text).toContain('• Basic futbolka — Oq, M × 2 = 258 000 so‘m')
    expect(text).toContain('Jami: 283 000 so‘m')
    expect(text).toContain('Izoh: Kechqurun')
    expect(text).toContain('https://bosmenti.uz/admin')
  })
})
