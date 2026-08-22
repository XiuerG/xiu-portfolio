"use client";

import { useState } from "react";
import { getAssetPath } from "@/lib/utils";

type Props = {
  /** Vimeo numeric video id, e.g. "935813613". */
  vimeoId: string;
  title: string;
  /** Poster frame in /public — shown until the viewer presses play. */
  poster?: string;
  caption?: string;
  /** Runtime badge, e.g. "4:12". */
  duration?: string;
  accent: string;
};

/**
 * Click-to-load Vimeo embed. The iframe (and Vimeo's scripts/cookies) are only
 * mounted once the viewer actually presses play, so the case study stays fast
 * and the still frame carries the page until then.
 */
export function VideoEmbed({
  vimeoId,
  title,
  poster,
  caption,
  duration,
  accent,
}: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure>
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-raised"
        style={{
          background: poster
            ? undefined
            : `linear-gradient(135deg, ${accent}33, ${accent}11)`,
        }}
      >
        {playing ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getAssetPath(poster)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
            <span
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,10,14,0.15), rgba(6,10,14,0.72))",
              }}
              aria-hidden
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                style={{ borderColor: accent, background: `${accent}26` }}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  className="ml-1 h-6 w-6"
                  fill={accent}
                  aria-hidden
                >
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-bone/90">
                Watch the walkthrough
                {duration ? ` · ${duration}` : ""}
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-xs text-mist">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
