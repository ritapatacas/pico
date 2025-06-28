import type React from "react"
export function FlagPT(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="24" {...props}>
      <path fill="#f00" d="M0 0h900v600H0z" />
      <path fill="#060" d="M0 0h450v600H0z" />
      <circle cx="225" cy="300" r="120" fill="#ff0" />
      <circle cx="225" cy="300" r="100" fill="#fff" />
      <circle cx="225" cy="300" r="80" fill="#f00" />
      <path fill="#fff" d="M225 220l-20 60h65l-50 40 20 60-55-40-55 40 20-60-50-40h65z" />
    </svg>
  )
} 