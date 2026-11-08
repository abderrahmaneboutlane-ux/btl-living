import { waLink } from "@/lib/site";

export default function FloatingWhatsApp() {
  const href = waLink(
    "Bonjour BTL LIVING, je souhaite des informations.",
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Écrire sur WhatsApp"
      className="fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-porcelain shadow-[0_16px_40px_-14px_rgba(26,21,18,0.6)] transition-all duration-500 ease-luxe hover:-translate-y-1 hover:bg-cognac"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.9 12.35l-.35.55.83 3-3.08-.8-.53.3A8.1 8.1 0 1 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.77.35-.27.28-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.3 5.13 4.5 2.55 1 3.07.8 3.62.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.55Z" />
      </svg>
    </a>
  );
}