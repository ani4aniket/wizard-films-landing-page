import { cn } from "@/lib/utils"
import { WhatsappIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
const WHATSAPP_PHONE = "+918708813814"
const WHATSAPP_MESSAGE = "Hello"

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "pill-feedback fixed right-4 bottom-4 z-40",
        "flex h-14 w-14 items-center justify-center rounded-full border",
        "border-primary bg-primary text-primary-foreground",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:scale-105 hover:bg-black/92",
        "focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none",
        "shadow-[0_8px_24px_-8px_rgba(18,140,126,0.45)]",
        "hover:shadow-[0_12px_28px_-10px_rgba(18,140,126,0.55)]",
        "print:hidden"
      )}
      aria-label="Chat on WhatsApp"
    >
      <HugeiconsIcon
        icon={WhatsappIcon}
        size={22}
        color="currentColor"
        strokeWidth={1.5}
      />
    </a>
  )
}
