import { useContactDetails } from "@/lib/cms";

/** Floating, softly glowing WhatsApp contact button (bottom-right). */
export function WhatsAppButton() {
  const { data: contact } = useContactDetails();
  const raw = contact?.whatsapp || contact?.phone || "+9779801040899";
  const number = raw.replace(/[^\d]/g, "");
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent("Hi Story Painters, I'd like to discuss a project.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full bg-[#5e9c75] text-white shadow-[0_0_0_0_rgba(37,211,102,0.6)] animate-[waPulse_2.2s_ease-in-out_infinite] hover:scale-110 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.594 4.463 1.723 6.406L3.2 28.8l6.56-1.712a12.74 12.74 0 0 0 6.243 1.606h.005c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.694-12.805-12.694zm0 23.09h-.004a10.6 10.6 0 0 1-5.4-1.48l-.387-.23-4.03 1.052 1.076-3.93-.253-.403a10.57 10.57 0 0 1-1.62-5.64c0-5.87 4.777-10.646 10.65-10.646 2.844 0 5.518 1.108 7.53 3.12a10.58 10.58 0 0 1 3.117 7.53c0 5.873-4.777 10.65-10.68 10.65zm5.84-7.974c-.32-.16-1.894-.935-2.188-1.042-.293-.107-.507-.16-.72.16-.214.32-.827 1.042-1.014 1.256-.187.213-.373.24-.693.08-.32-.16-1.352-.498-2.575-1.59-.952-.85-1.594-1.898-1.78-2.218-.187-.32-.02-.494.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.214.053-.4-.027-.56-.08-.16-.72-1.737-.987-2.378-.26-.624-.523-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.67s1.147 3.098 1.307 3.312c.16.213 2.257 3.446 5.47 4.832.765.33 1.362.527 1.827.674.767.244 1.466.21 2.018.127.616-.092 1.894-.774 2.16-1.522.267-.747.267-1.387.187-1.52-.08-.134-.293-.214-.613-.374z" />
      </svg>
    </a>
  );
}