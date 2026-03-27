/**
 * Sticky horizontal jump links for long club pages. Placed below ClubHeader;
 * scroll targets use matching ids on ClubPage sections (scroll-mt-* on targets).
 * Active section: terracotta text + underline (scroll-spy).
 */
import { useCallback, useEffect, useRef, useState } from "react";

/** Pixels from viewport top: site sticky header (~64px) + approximate strip height */
const SCROLL_SPY_OFFSET = 120;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function ClubSectionNav({ items }) {
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [activeId, setActiveId] = useState(() => items[0]?.id ?? null);

  const updateActiveFromScroll = useCallback(() => {
    const list = itemsRef.current;
    if (!list.length) return;

    const scrollY = window.scrollY;
    const viewport = window.innerHeight;
    const docEl = document.documentElement;

    if (docEl.scrollHeight - viewport > 0 && scrollY + viewport >= docEl.scrollHeight - 4) {
      setActiveId(list[list.length - 1].id);
      return;
    }

    let current = list[0].id;
    for (const { id } of list) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= scrollY + SCROLL_SPY_OFFSET) {
        current = id;
      }
    }
    setActiveId(current);
  }, []);

  useEffect(() => {
    setActiveId((prev) => {
      const first = items[0]?.id;
      if (!first) return prev;
      if (!items.some((i) => i.id === prev)) return first;
      return prev;
    });
  }, [items]);

  useEffect(() => {
    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, [updateActiveFromScroll]);

  if (!items?.length) return null;

  return (
    <div className="sticky top-16 z-30 w-full bg-white border-b border-stone-200/90">
      <nav
        aria-label="Club page sections"
        className="max-w-6xl mx-auto px-5 sm:px-6 py-3 overflow-x-auto [scrollbar-width:thin]"
      >
        <ul className="flex flex-nowrap gap-6 sm:gap-8 m-0 p-0 list-none items-baseline">
          {items.map(({ id, label }) => {
            const isActive = id === activeId;
            return (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveId(id);
                    scrollToSection(id);
                  }}
                  className={[
                    "font-nunito font-semibold text-[15px] sm:text-base tracking-[0.01em] whitespace-nowrap transition-colors duration-150",
                    "decoration-[#C45D3E] decoration-1 underline-offset-[0.1em]",
                    "focus:outline-none focus-visible:underline",
                    isActive
                      ? "text-[#C45D3E] underline"
                      : "text-[#2f2a26] no-underline hover:text-[#1A1410] hover:underline",
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
