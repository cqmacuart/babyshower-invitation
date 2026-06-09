import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Gift as GiftIcon, Banknote, Phone, Mail, User, ChevronLeft, ChevronRight } from "lucide-react";
import type { Gift } from "@/lib/types";

const GIFT_PAGE_SIZE = 10;

export type RsvpData = {
  nombre: string;
  telefono: string;
  email: string;
  regaloId: string;
  regaloNombre: string;
  attending: boolean;
  asistentes: number;
};

const CASH_GIFT: Gift = {
  id: "cash",
  title: "Regalo en efectivo",
  description: "Contribución directa para la nueva familia",
  status: "Available",
};

export function RsvpFlow({
  gifts,
  onSubmit,
  submitting,
  defaultValues,
}: {
  gifts: Gift[];
  onSubmit: (data: RsvpData) => Promise<void> | void;
  submitting: boolean;
  defaultValues?: { nombre?: string; telefono?: string; email?: string };
}) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [form, setForm] = useState({
    nombre: defaultValues?.nombre ?? "",
    telefono: defaultValues?.telefono ?? "",
    email: defaultValues?.email ?? "",
  });
  const [asistentes, setAsistentes] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [giftPage, setGiftPage] = useState(0);

  const availableGifts = gifts.filter((g) => g.status === 'Available');
  const totalGiftPages = Math.ceil(availableGifts.length / GIFT_PAGE_SIZE);
  const paginated = availableGifts.length > GIFT_PAGE_SIZE;
  const pageGifts = availableGifts.slice(giftPage * GIFT_PAGE_SIZE, giftPage * GIFT_PAGE_SIZE + GIFT_PAGE_SIZE);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (attending === null) {
      setError("¿Asistirás o no asistirás?");
      return;
    }
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError("Necesitamos tu nombre y teléfono");
      return;
    }
    await onSubmit({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      regaloId: selectedGift?.id ?? "",
      regaloNombre: selectedGift?.title ?? "",
      attending,
      asistentes,
    });
  };

  return (
    <div className="space-y-8">
      {/* Gift list */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <h3 className="font-display text-2xl text-ink">Lista de regalos</h3>
          <span className="rounded-full bg-pink/20 px-3 py-1 font-mono text-xs text-pink-deep">
            {availableGifts.length} disponibles
          </span>
        </div>
        <p className="mb-4 text-sm italic text-ink-soft">
          Si deseas, selecciona un detalle de la lista para llevar (opcional).
        </p>

        {/* Grid with floating chevrons */}
        <div className="relative">
          {/* Left chevron */}
          <AnimatePresence>
            {paginated && giftPage > 0 && (
              <motion.button
                key="prev"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                type="button"
                onClick={() => setGiftPage((p) => Math.max(0, p - 1))}
                aria-label="Página anterior"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-transform active:scale-90"
                style={{
                  background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)',
                  color: 'white',
                  boxShadow: '0 6px 18px -4px rgba(201,184,245,0.6)',
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right chevron */}
          <AnimatePresence>
            {paginated && giftPage < totalGiftPages - 1 && (
              <motion.button
                key="next"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                type="button"
                onClick={() => setGiftPage((p) => Math.min(totalGiftPages - 1, p + 1))}
                aria-label="Página siguiente"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-transform active:scale-90"
                style={{
                  background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)',
                  color: 'white',
                  boxShadow: '0 6px 18px -4px rgba(201,184,245,0.6)',
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={giftPage}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="grid grid-cols-2 gap-3"
            >
              {pageGifts.map((g) => {
                const selected = selectedGift?.id === g.id;
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setSelectedGift(selected ? null : g)}
                    className={`relative rounded-3xl border p-4 text-left transition-all active:scale-95 ${
                      selected
                        ? "border-lilac bg-lilac/15 shadow-md shadow-lilac/20"
                        : "border-slate-100 bg-white shadow-sm"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-lilac text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/40">
                      <GiftIcon className="h-5 w-5 text-ink" />
                    </div>
                    <p className="font-display text-sm text-ink">{g.title}</p>
                    {g.description && (
                      <p className="mt-1 text-xs text-ink-soft">{g.description}</p>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page dots */}
        {paginated && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: totalGiftPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setGiftPage(i)}
                aria-label={`Página ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width: i === giftPage ? 20 : 8,
                  height: 8,
                  background: i === giftPage
                    ? 'linear-gradient(90deg, #C9B8F5, #F5C0D0)'
                    : '#E9DFD5',
                }}
              />
            ))}
          </div>
        )}

        {/* Cash — always visible below the paginated list */}
        {(() => {
          const cashSelected = selectedGift?.id === 'cash';
          return (
            <button
              type="button"
              onClick={() => setSelectedGift(cashSelected ? null : CASH_GIFT)}
              className={`mt-3 col-span-2 w-full relative rounded-3xl border p-4 text-left transition-all active:scale-95 ${
                cashSelected
                  ? "border-lilac bg-lilac/15 shadow-md shadow-lilac/20"
                  : "border-slate-100 bg-butter/60 shadow-sm"
              }`}
            >
              {cashSelected && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-lilac text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                <Banknote className="h-5 w-5 text-pink-deep" />
              </div>
              <p className="font-display text-sm text-ink">{CASH_GIFT.title}</p>
              {CASH_GIFT.description && (
                <p className="mt-1 text-xs text-ink-soft">{CASH_GIFT.description}</p>
              )}
            </button>
          );
        })()}
      </section>

      {/* RSVP card */}
      <section className="rounded-[2.5rem] bg-lilac p-7 text-white shadow-xl shadow-lilac/30">
        <h3 className="mb-1 font-display text-3xl">¿Nos acompañas?</h3>
        <p className="mb-6 text-sm opacity-90">
          Por favor confirma tu asistencia
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`rounded-2xl py-4 font-bold transition-all ${
                attending === true
                  ? "bg-white text-lilac shadow-lg"
                  : "bg-white/20 text-white"
              }`}
            >
              ¡Asistiré!
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`rounded-2xl py-4 font-bold transition-all ${
                attending === false
                  ? "bg-white text-pink-deep shadow-lg"
                  : "bg-white/20 text-white"
              }`}
            >
              No podré
            </button>
          </div>

          <Field icon={<User className="h-4 w-4" />}>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
            />
          </Field>
          <Field icon={<Phone className="h-4 w-4" />}>
            <input
              type="tel"
              required
              maxLength={40}
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
            />
          </Field>
          <Field icon={<Mail className="h-4 w-4" />}>
            <input
              type="email"
              maxLength={200}
              placeholder="Correo (opcional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
            />
          </Field>

          {/* Separador */}
          <div className="flex items-center gap-3 opacity-40">
            <div className="flex-1 h-px bg-white" />
          </div>

          {/* Número de asistentes */}
          <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/20 px-5 py-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">¿Cuántos asistirán?</span>
              <span className="text-xs text-white/60">Inclúyete a ti</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAsistentes((n) => Math.max(1, n - 1))}
                disabled={asistentes <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white font-bold text-lg leading-none transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-white text-base">{asistentes}</span>
              <button
                type="button"
                onClick={() => setAsistentes((n) => n + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white font-bold text-lg leading-none transition-all active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl bg-white/20 px-4 py-2 text-center text-sm font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-butter py-5 font-display text-xl text-ink shadow-xl transition-transform active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Confirmar"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/20 px-5 py-4 focus-within:bg-white/30">
      <span className="text-white/80">{icon}</span>
      {children}
    </div>
  );
}
