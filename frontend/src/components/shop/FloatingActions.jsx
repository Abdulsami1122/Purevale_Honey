import React from 'react'
import { MessageCircle } from 'lucide-react'
import { WhatsappIcon } from './BrandIcons'
import './FloatingActions.css'

const FloatingActions = () => (
  <div className="floating-actions">
    <a
      className="floating-whatsapp"
      href="https://wa.me/923339300672"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsappIcon size={34} />
    </a>

    <button type="button" className="floating-chat">
      <MessageCircle size={18} strokeWidth={2} />
      Chat
    </button>
  </div>
)

export default FloatingActions
