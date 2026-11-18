import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-5 py-28 sm:px-8">
      <title>Sahifa topilmadi — Mustafa English</title>
      <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-gold">404</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Sahifa topilmadi
      </h1>
      <p className="mt-5 max-w-md text-lg text-muted">
        Siz qidirgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.
      </p>
      <Button to="/" arrow className="mt-9">
        Bosh sahifaga qaytish
      </Button>
    </section>
  )
}
