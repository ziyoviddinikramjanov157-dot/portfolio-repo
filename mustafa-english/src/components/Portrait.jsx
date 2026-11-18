import { profile } from '../data/site.js'

export default function Portrait() {
  if (profile.photo) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        className="aspect-[4/5] w-full rounded-3xl border border-line object-cover"
      />
    )
  }

  return (
    <div className="relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-3xl border border-line bg-surface">
      <span
        aria-hidden="true"
        className="font-display text-[clamp(5rem,14vw,8rem)] font-extrabold leading-none tracking-tighter text-gold/20"
      >
        MK
      </span>
      <p className="absolute inset-x-0 bottom-0 border-t border-line bg-ink/70 px-5 py-4 text-sm text-muted">
        Bu yerga Mustafa Kambarovning rasmi qo‘yiladi
      </p>
    </div>
  )
}
