import { useState } from 'react'

export function CopyCommand({ command, className = '' }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`cmd w-full min-w-0 ${className}`}>
      <code>{command}</code>
      <button type='button' onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
