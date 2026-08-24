import React from 'react'

/* Brand marks are not part of lucide-react, so they live here as inline SVG. */

export const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14.5 8.5h2.2V5.6c-.4-.05-1.7-.17-3.2-.17-3.2 0-5.3 1.9-5.3 5.4v2.6H5.5v3.3h2.7V25h3.3v-8.27h2.7l.4-3.3h-3.1v-2.3c0-.95.26-1.63 1.6-1.63z" />
  </svg>
)

export const InstagramIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const YoutubeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.5 7.6a2.9 2.9 0 0 0-2-2.05C18.7 5.05 12 5.05 12 5.05s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2.05A30.4 30.4 0 0 0 1 12a30.4 30.4 0 0 0 .5 4.4 2.9 2.9 0 0 0 2 2.05c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2.05A30.4 30.4 0 0 0 23 12a30.4 30.4 0 0 0-.5-4.4ZM9.9 15.3V8.7L15.4 12l-5.5 3.3Z" />
  </svg>
)

export const TiktokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.1 2h-3.2v13.1a2.6 2.6 0 1 1-2.2-2.57V9.24a5.85 5.85 0 1 0 5.4 5.83V8.9a6.6 6.6 0 0 0 3.9 1.26V6.93A3.75 3.75 0 0 1 16.1 3.9V2Z" />
  </svg>
)

export const WhatsappIcon = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16.04 3.2c-7.1 0-12.86 5.76-12.86 12.86 0 2.27.6 4.48 1.73 6.43L3.07 29.2l6.9-1.8a12.8 12.8 0 0 0 6.06 1.54h.01c7.09 0 12.85-5.77 12.85-12.87 0-3.43-1.34-6.66-3.76-9.09a12.77 12.77 0 0 0-9.09-3.78Zm0 23.1a10.7 10.7 0 0 1-5.44-1.49l-.39-.23-4.09 1.07 1.09-3.99-.25-.41a10.65 10.65 0 0 1-1.64-5.69c0-5.9 4.8-10.7 10.72-10.7 2.86 0 5.55 1.12 7.57 3.14a10.62 10.62 0 0 1 3.13 7.57c0 5.9-4.8 10.73-10.7 10.73Zm5.87-8.02c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.72.16-.22.32-.83 1.04-1.02 1.26-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.32 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
  </svg>
)
