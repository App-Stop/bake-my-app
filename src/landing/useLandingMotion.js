import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const unique = (items) => [...new Set(items)]

/** Page entrance and section-by-section reveal motion for public marketing pages. */
export function useLandingMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      const heroItems = root.querySelectorAll('header h1, header h1 + p, header [data-motion-hero]')
      gsap.fromTo(
        heroItems,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
      )

      root.querySelectorAll('main section').forEach((section) => {
        const direct = [...section.querySelectorAll(':scope > div > *')]
        const headings = [...section.querySelectorAll('h2, h3')]
        const targets = unique([...direct, ...headings]).filter(
          (element) => !element.closest('[data-motion-skip]') && !targetsContainAncestor(element, direct),
        )

        if (targets.length) {
          gsap.fromTo(
            targets,
            { autoAlpha: 0, y: 34 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: section, start: 'top 82%', once: true },
            },
          )
        }

        section.querySelectorAll('.grid, ul').forEach((group) => {
          const children = [...group.children].filter((child) => !child.closest('[data-motion-skip]'))
          if (children.length < 2 || children.length > 12) return
          gsap.fromTo(
            children,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              stagger: 0.07,
              ease: 'power2.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: group, start: 'top 86%', once: true },
            },
          )
        })
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)

    return () => context.revert()
  }, [rootRef])
}

function targetsContainAncestor(element, directTargets) {
  return directTargets.some((target) => target !== element && target.contains(element))
}
