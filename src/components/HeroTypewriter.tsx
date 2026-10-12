import { useEffect, useState } from "react";

interface HeroTypewriterProps {
  text: string;
  /** Delay between characters, in ms. */
  speed?: number;
  /** How long the finished line (with blinking caret) stays before retyping, in ms. */
  restartDelay?: number;
}

/**
 * Typewriter tagline for the hero: types the text, keeps a blinking caret,
 * then clears and retypes after `restartDelay`.
 */
export function HeroTypewriter({
  text,
  speed = 30,
  restartDelay = 10_000,
}: HeroTypewriterProps) {
  const [count, setCount] = useState(0);

useEffect(() => {
  let timer: number | undefined;
  let cancelled = false;

  const startTimer = window.setTimeout(() => {
    if (cancelled) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      setCount(text.length);
      return;
    }

    const typeNext = (i: number) => {
      if (cancelled) return;

      setCount(i);

      timer = window.setTimeout(
        () => typeNext(i < text.length ? i + 1 : 0),
        i < text.length ? speed : restartDelay
      );
    };

    typeNext(1);
  }, 600);

  return () => {
    cancelled = true;
    window.clearTimeout(startTimer);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}, [text, speed, restartDelay]);

const visibleText = text.slice(0, count);
  const settledText = visibleText.slice(0, Math.max(0, visibleText.length - 1));
  const activeCharacter = visibleText.slice(-1);



  return (
    <p className="relative isolate mt-6 max-w-md text-xs leading-relaxed text-foreground/80 sm:mt-10 sm:text-sm animate-[slideInUp_0.9s_ease-out_0.95s_both]">
      <span
        aria-hidden="true"
        className="projector-field pointer-events-none absolute -inset-x-3 -inset-y-2 -z-10 overflow-hidden sm:-inset-x-5 sm:-inset-y-3"
      >
        <span className="projector-grain absolute inset-0 opacity-20 sm:opacity-30" />
      </span>
      {/* Sizer keeps the layout stable while the text types and retypes. */}
      <span className="invisible block border-l border-transparent pl-4 uppercase tracking-wider sm:pl-6">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 border-l border-accent pl-4 uppercase tracking-wider sm:pl-6 font-mono underline decoration-accent decoration-2 decoration-solid"
      >
         {settledText}
        {activeCharacter ? (
          <span key={count} className="typewriter-ignition text-projector">
            {activeCharacter}
          </span>
        ) : null}
        <span
                    className="typewriter-caret ml-1 inline-block h-[1em] w-0.5 translate-y-[0.12em] bg-projector"

        />
      </span>
      <span className="sr-only">{text}</span>
    </p>
  );
}
