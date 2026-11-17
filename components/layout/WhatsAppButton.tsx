import { STUDIO_NAME, WHATSAPP_URL } from "@/lib/content";
import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton() {
  return (
    <a className={styles.wa} href={WHATSAPP_URL} target="_blank" rel="noopener" aria-label={`Chat with ${STUDIO_NAME} on WhatsApp`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#fff" d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 2a7 7 0 1 1-3.6 13l-.4-.2-2.1.6.6-2-.3-.5A7 7 0 0 1 12 5Z" />
      </svg>
      <span className={styles.label}>WhatsApp</span>
    </a>
  );
}
