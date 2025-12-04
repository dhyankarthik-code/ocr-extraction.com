"use client"

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type MenuItem = {
    label: string
    href: string
    ariaLabel?: string
    rotation?: number
    hoverStyles?: {
        bgColor?: string
        textColor?: string
    }
}

export type BubbleMenuProps = {
    logo: ReactNode | string
    onMenuClick?: (open: boolean) => void
    className?: string
    style?: CSSProperties
    menuAriaLabel?: string
    menuBg?: string
    menuContentColor?: string
    useFixedPosition?: boolean
    items?: MenuItem[]
    animationEase?: string
    animationDuration?: number
    staggerDelay?: number
    userSection?: ReactNode
}

export default function BubbleMenu({
    logo,
    onMenuClick,
    className,
    style,
    menuAriaLabel = 'Toggle menu',
    menuBg = '#fff',
    menuContentColor = '#111',
    useFixedPosition = false,
    items = [],
    animationEase = 'power4.out',
    animationDuration = 0.8,
    staggerDelay = 0.1,
    userSection
}: BubbleMenuProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)

    const overlayRef = useRef<HTMLDivElement>(null)
    const bubblesRef = useRef<HTMLAnchorElement[]>([])
    const labelRefs = useRef<HTMLSpanElement[]>([])

    const containerClassName = [
        'bubble-menu',
        useFixedPosition ? 'fixed' : 'absolute',
        'left-0 right-0 top-8',
        'flex items-center justify-between',
        'gap-4 px-8',
        'pointer-events-none',
        'z-[1001]',
        className
    ]
        .filter(Boolean)
        .join(' ')

    const handleToggle = () => {
        const nextState = !isMenuOpen
        if (nextState) setShowOverlay(true)
        setIsMenuOpen(nextState)
        onMenuClick?.(nextState)
    }

    useEffect(() => {
        const overlay = overlayRef.current
        const bubbles = bubblesRef.current.filter(Boolean)
        const labels = labelRefs.current.filter(Boolean)
        if (!overlay || !bubbles.length) return

        if (isMenuOpen) {
            gsap.set(overlay, { display: 'flex' })
            gsap.killTweensOf([...bubbles, ...labels])
            gsap.set(bubbles, { scale: 0, y: 50, transformOrigin: '50% 50%' })
            gsap.set(labels, { y: 24, autoAlpha: 0 })

            bubbles.forEach((bubble, i) => {
                const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05)
                const tl = gsap.timeline({ delay })
                tl.to(bubble, {
                    scale: 1,
                    y: 0,
                    duration: animationDuration,
                    ease: animationEase
                })
                if (labels[i]) {
                    tl.to(
                        labels[i],
                        {
                            y: 0,
                            autoAlpha: 1,
                            duration: animationDuration,
                            ease: 'power3.out'
                        },
                        '-=' + animationDuration * 0.9
                    )
                }
            })
        } else if (showOverlay) {
            gsap.killTweensOf([...bubbles, ...labels])
            gsap.to(labels, {
                y: 24,
                autoAlpha: 0,
                duration: 0.2,
                ease: 'power3.in'
            })
            gsap.to(bubbles, {
                scale: 0,
                duration: 0.2,
                ease: 'power3.in',
                onComplete: () => {
                    gsap.set(overlay, { display: 'none' })
                    setShowOverlay(false)
                }
            })
        }
    }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay])

    useEffect(() => {
        const handleResize = () => {
            if (isMenuOpen) {
                const bubbles = bubblesRef.current.filter(Boolean)
                const isDesktop = window.innerWidth >= 900
                bubbles.forEach((bubble, i) => {
                    const item = items[i]
                    if (bubble && item) {
                        const rotation = isDesktop ? (item.rotation ?? 0) : 0
                        gsap.set(bubble, { rotation })
                    }
                })
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isMenuOpen, items])

    return (
        <>
            <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }

        .bubble-menu-items {
          padding-top: clamp(6rem, 10vw, 8rem);
          padding-bottom: clamp(2rem, 6vw, 4rem);
          padding-inline: clamp(1.5rem, 5vw, 4rem);
        }

        .bubble-menu-items .pill-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1rem, 2vw, 2rem);
          width: min(1100px, 100%);
          margin-inline: auto;
        }

        .bubble-menu-items .pill-col {
          height: 100%;
        }

        .bubble-menu-items .pill-link {
          border-radius: 32px;
          padding: clamp(1.25rem, 2vw, 2.5rem);
          min-height: 150px;
          font-size: clamp(1.125rem, 1.8vw, 1.75rem);
          line-height: 1.3;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--pill-bg);
          color: var(--pill-color);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .bubble-menu-items .pill-link:hover {
            background: var(--hover-bg);
            color: var(--hover-color);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
            transform: translateY(-6px);
          }
          .bubble-menu-items .pill-link:active {
            transform: translateY(-2px) scale(0.98);
          }
        }

        @media (min-width: 768px) {
          .bubble-menu-items .pill-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .bubble-menu-items {
            padding-top: 120px;
            align-items: flex-start;
          }
          .bubble-menu-items .pill-link {
            min-height: 120px;
            font-size: clamp(1.15rem, 4vw, 1.6rem);
          }
        }
      `}</style>

            <nav className={containerClassName} style={style} aria-label="Main navigation">
                <div
                    className={[
                        'bubble logo-bubble',
                        'inline-flex items-center justify-center',
                        'rounded-full',
                        'bg-white',
                        'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
                        'pointer-events-auto',
                        'h-12 md:h-14',
                        'px-4 md:px-8',
                        'gap-2',
                        'will-change-transform'
                    ].join(' ')}
                    aria-label="Logo"
                    style={{
                        background: menuBg,
                        minHeight: '48px',
                        borderRadius: '9999px'
                    }}
                >
                    <span
                        className={['logo-content', 'inline-flex items-center justify-center', 'w-[120px] h-full'].join(' ')}
                        style={
                            {
                                ['--logo-max-height']: '60%',
                                ['--logo-max-width']: '100%'
                            } as CSSProperties
                        }
                    >
                        {typeof logo === 'string' ? (
                            <img src={logo} alt="Logo" className="bubble-logo max-h-[60%] max-w-full object-contain block" />
                        ) : (
                            logo
                        )}
                    </span>
                </div>

                <button
                    type="button"
                    className={[
                        'bubble toggle-bubble menu-btn',
                        isMenuOpen ? 'open' : '',
                        'inline-flex flex-col items-center justify-center',
                        'rounded-full',
                        'bg-white',
                        'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
                        'pointer-events-auto',
                        'w-12 h-12 md:w-14 md:h-14',
                        'border-0 cursor-pointer p-0',
                        'will-change-transform'
                    ].join(' ')}
                    onClick={handleToggle}
                    aria-label={menuAriaLabel}
                    aria-pressed={isMenuOpen}
                    style={{ background: menuBg }}
                >
                    <span
                        className="menu-line block mx-auto rounded-[2px]"
                        style={{
                            width: 26,
                            height: 2,
                            background: menuContentColor,
                            transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : 'none'
                        }}
                    />
                    <span
                        className="menu-line short block mx-auto rounded-[2px]"
                        style={{
                            marginTop: '6px',
                            width: 26,
                            height: 2,
                            background: menuContentColor,
                            transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none'
                        }}
                    />
                </button>
            </nav>

            {showOverlay && (
                <div
                    ref={overlayRef}
                    className={[
                        'bubble-menu-items',
                        useFixedPosition ? 'fixed' : 'absolute',
                        'inset-0',
                        'flex flex-col items-center justify-center',
                        'pointer-events-none',
                        'z-[1000]',
                        'bg-white/95 backdrop-blur-sm'
                    ].join(' ')}
                    aria-hidden={!isMenuOpen}
                >
                    {/* User Section at Top */}
                    {userSection && (
                        <div className="w-full max-w-md px-6 mb-8 pointer-events-auto">
                            {userSection}
                        </div>
                    )}

                    <ul
                        className={[
                            'pill-list',
                            'list-none m-0 px-6',
                            'w-full mx-auto',
                            'pointer-events-auto'
                        ].join(' ')}
                        role="menu"
                        aria-label="Menu links"
                    >
                        {items.map((item, idx) => (
                            <li
                                key={idx}
                                role="none"
                                className="pill-col"
                            >
                                <a
                                    role="menuitem"
                                    href={item.href}
                                    aria-label={item.ariaLabel || item.label}
                                    className={[
                                        'pill-link',
                                        'w-full',
                                        'no-underline',
                                        'shadow-[0_10px_30px_rgba(0,0,0,0.08)]',
                                        'flex items-center justify-center',
                                        'relative',
                                        'box-border',
                                        'overflow-hidden'
                                    ].join(' ')}
                                    style={
                                        {
                                            ['--pill-bg']: menuBg,
                                            ['--pill-color']: menuContentColor,
                                            ['--hover-bg']: item.hoverStyles?.bgColor || '#ef4444',
                                            ['--hover-color']: item.hoverStyles?.textColor || '#ffffff'
                                        } as CSSProperties
                                    }
                                    ref={el => {
                                        if (el) bubblesRef.current[idx] = el
                                    }}
                                >
                                    <span
                                        className="pill-label inline-block"
                                        style={{
                                            willChange: 'transform, opacity',
                                            height: '1.2em',
                                            lineHeight: 1.2
                                        }}
                                        ref={el => {
                                            if (el) labelRefs.current[idx] = el
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}
