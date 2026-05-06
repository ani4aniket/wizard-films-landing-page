import { cn } from "@/lib/utils"

const WHATSAPP_PHONE = "+918708813814"
const WHATSAPP_MESSAGE = "hello"

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-4 right-4 z-40",
        "w-14 h-14 rounded-full",
        "bg-[#25D366] hover:bg-[#20ba5a]",
        "flex items-center justify-center",
        "transition-transform duration-200 ease-out",
        "hover:scale-110",
        "shadow-lg hover:shadow-xl",
        "print:hidden"
      )}
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp Icon SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.082.398-2.846 1.118-.766.721-1.188 1.681-1.188 2.691 0 2.144 1.746 3.89 3.888 3.89 1.052 0 2.082-.398 2.846-1.119.766-.719 1.188-1.681 1.188-2.691 0-1.045-.428-2.026-1.207-2.765-.776-.74-1.813-1.147-2.887-1.124zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    </a>
  )
}
