import { useEffect, useRef } from 'react'

// Adds .is-in to .reveal elements as they enter the viewport. Restrained on purpose.
// Sections below the fold are code-split + Suspense-mounted AFTER this hook first runs, so a
// one-shot querySelectorAll would miss them and leave them invisible forever. We watch the
// subtree with a MutationObserver and start observing any .reveal node the moment it mounts.
export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const noIO = !('IntersectionObserver' in window)
    const seen = new WeakSet()

    const reveal = (el) => el.classList.add('is-in')

    const io = noIO
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                reveal(e.target)
                io.unobserve(e.target)
              }
            })
          },
          { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        )

    const register = (el) => {
      if (!el || seen.has(el)) return
      seen.add(el)
      if (io) io.observe(el)
      else reveal(el)
    }

    const scan = (node) => {
      if (node.nodeType !== 1) return
      if (node.classList?.contains('reveal')) register(node)
      node.querySelectorAll?.('.reveal').forEach(register)
    }

    // initial pass
    scan(root)

    // catch lazily-mounted sections as they appear
    const mo = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach(scan))
    })
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io?.disconnect()
    }
  }, [])

  return ref
}
