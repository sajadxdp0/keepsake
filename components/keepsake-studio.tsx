"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowDownToLine, ArrowUpRight, ImagePlus, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_NAME_LENGTH = 48;

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[char]!);
}

function makeKeepsakeSvg(name: string) {
  const safeName = escapeXml(name);
  const fontSize = Math.max(30, Math.min(82, 1320 / Math.max(Array.from(name).length * 0.58, 1)));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="#1a1b26"/>
  <rect x="36" y="36" width="1528" height="928" fill="none" stroke="#414868" stroke-width="2"/>
  <path d="M36 150V36h114M1446 36h118v114M36 850v114h114m1296 0h118V850" fill="none" stroke="#9ece6a" stroke-width="3"/>
  <text x="96" y="112" fill="#c0caf5" font-family="monospace" font-size="18" letter-spacing="4">KEEPSAKE</text>
  <text x="1504" y="112" text-anchor="end" fill="#565f89" font-family="monospace" font-size="16" letter-spacing="3">A PERSONAL MOMENT</text>
  <circle cx="800" cy="285" r="31" fill="none" stroke="#9ece6a" stroke-width="2"/><text x="800" y="296" text-anchor="middle" fill="#9ece6a" font-family="monospace" font-size="26">✳</text>
  <text x="800" y="385" text-anchor="middle" fill="#9ece6a" font-family="monospace" font-size="16" letter-spacing="6">A MOMENT TO KEEP</text>
  <text x="800" y="525" text-anchor="middle" fill="#c0caf5" font-family="monospace" font-size="${fontSize}" font-weight="500">${safeName}</text>
  <path d="M678 568h90m64 0h90" stroke="#414868" stroke-width="2"/><circle cx="800" cy="568" r="4" fill="#9ece6a"/>
  <text x="800" y="630" text-anchor="middle" fill="#a9b1d6" font-family="monospace" font-size="21">For the little things you want to remember.</text>
  <text x="800" y="885" text-anchor="middle" fill="#565f89" font-family="monospace" font-size="14" letter-spacing="3">PERSONAL KEEPSAKE · NOT OFFICIAL DOCUMENTATION</text>
  </svg>`;
}

export function KeepsakeStudio() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.url);
    };
  }, [photo]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) setPhoto({ file, url: URL.createObjectURL(file) });
    event.currentTarget.value = "";
  }

  function removePhoto() {
    setPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function downloadOriginal() {
    if (!photo) return;
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = photo.file.name;
    link.click();
  }

  function downloadKeepsake() {
    const cleanName = name.trim();
    if (!cleanName) return;

    const svgUrl = URL.createObjectURL(new Blob([makeKeepsakeSvg(cleanName)], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 1500;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "keepsake.png";
        link.click();
        URL.revokeObjectURL(downloadUrl);
      }, "image/png");
    };
    image.onerror = () => URL.revokeObjectURL(svgUrl);
    image.src = svgUrl;
  }


  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-8 sm:px-8">
      <header className="flex h-[68px] items-center justify-between border-b border-border">
        <a href="#top" className="flex items-center gap-3 font-mono text-sm font-semibold tracking-tight text-foreground">
          <span className="grid size-8 place-items-center border border-primary/60 text-primary"><Sparkles size={15} strokeWidth={1.6} /></span>
          <span>Keepsake</span>
        </a>
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
          <LockKeyhole size={12} aria-hidden="true" /> LOCAL BY DESIGN
        </span>
      </header>

      <section id="top" className="grid gap-8 pb-8 pt-10 sm:gap-10 sm:pt-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:pb-10">
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-primary">
            <span className="size-1.5 bg-primary" /> A SMALL SPACE FOR THE GOOD STUFF
          </p>
          <h1 className="max-w-xl font-mono text-4xl font-medium leading-[1.08] tracking-[-0.065em] text-foreground sm:text-5xl">
            Keep what<br /><span className="text-primary">matters.</span>
          </h1>
        </div>
        <p className="max-w-md font-mono text-xs leading-6 text-muted-foreground sm:justify-self-end">
          Add a name. Keep the photo original. Make a keepsake that feels like yours.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(300px,0.76fr)_minmax(0,1.24fr)] lg:gap-12" aria-label="Keepsake creator">
        <div className="border border-border bg-card p-5 sm:p-6">
          <div className="mb-7 flex items-start gap-3">
            <span className="pt-0.5 font-mono text-[10px] tracking-widest text-primary">01</span>
            <div>
              <h2 className="font-mono text-sm font-medium text-foreground">Make it yours</h2>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">One name. One moment.</p>
            </div>
          </div>

          <label htmlFor="name" className="mb-2 block font-mono text-[10px] tracking-[0.12em] text-muted-foreground">YOUR NAME</label>
          <Input
            id="name"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Type your name"
            aria-describedby="name-help"
          />
          <div id="name-help" className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground/80">
            <span>As you’d like it shown</span><span>{name.length}/{MAX_NAME_LENGTH}</span>
          </div>

          <div className="mb-2 mt-7 flex items-center justify-between">
            <label htmlFor="photo" className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">A PHOTO <span className="text-muted-foreground/70">· OPTIONAL</span></label>
            {photo && <button onClick={removePhoto} className="font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground" type="button">REMOVE</button>}
          </div>
          <label htmlFor="photo" className="group flex min-h-16 cursor-pointer items-center gap-3 border border-dashed border-border bg-background/55 px-3 py-3 transition-colors hover:border-primary/60">
            <span className="grid size-9 shrink-0 place-items-center border border-border text-primary transition-colors group-hover:border-primary/50"><ImagePlus size={16} strokeWidth={1.6} /></span>
            <span className="min-w-0">
              <span className="block font-mono text-[11px] text-foreground">{photo ? "Change photo" : "Choose a photo"}</span>
              <span className="mt-1 block font-mono text-[9px] text-muted-foreground">Stays on this device · JPG, PNG, WebP</span>
            </span>
            <input ref={photoInputRef} id="photo" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
          </label>

          {photo && (
            <div className="photo-preview mt-4 border border-border p-2">
              <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[9px] text-muted-foreground">
                <span className="tracking-[0.1em]">ORIGINAL · UNCHANGED</span>
                <span className="max-w-[55%] truncate text-right" title={photo.file.name}>{photo.file.name}</span>
              </div>
              <img src={photo.url} alt="Original uploaded photo, unchanged" className="h-32 w-full object-contain outline outline-1 -outline-offset-1 outline-white/10" />
              <button type="button" onClick={downloadOriginal} className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-primary transition-colors hover:text-foreground">
                Download original <ArrowUpRight size={12} />
              </button>
            </div>
          )}


          <div className="mt-6 flex gap-2 border-l border-primary/60 bg-muted/35 px-3 py-2.5 font-mono text-[9px] leading-4 text-muted-foreground">
            <LockKeyhole size={13} className="mt-px shrink-0 text-primary" aria-hidden="true" />
            Your photo is never changed or uploaded. The name stays on a separate keepsake.
          </div>
          <Button className="mt-4 w-full justify-between px-4" onClick={downloadKeepsake} disabled={!name.trim()}>
            <span>Download keepsake</span><ArrowDownToLine size={15} />
          </Button>
          <p className="mt-2 text-center font-mono text-[9px] text-muted-foreground/70">PERSONAL · NOT OFFICIAL DOCUMENTATION</p>
        </div>

        <div className="min-w-0 self-center">
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
            <span>02 / PREVIEW</span><span className="flex items-center gap-1.5 text-primary"><span className="size-1.5 bg-primary" /> LIVE</span>
          </div>
          <div className="keepsake-card relative flex aspect-[1.58] max-[420px]:aspect-auto max-[420px]:min-h-72 flex-col justify-between overflow-hidden border border-border bg-background p-5 sm:p-8">
            <div className="pointer-events-none absolute inset-2 border border-border/70" />
            <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full border border-primary/20" />
            <div className="relative flex items-start justify-between font-mono text-[9px] tracking-[0.12em]">
              <span className="text-foreground">KEEPSAKE<span className="text-primary">/</span>01</span>
              <span className="text-muted-foreground">A PERSONAL MOMENT</span>
            </div>
            <div className="relative my-auto px-2 py-7 text-center">
              <span className="mx-auto mb-4 grid size-8 place-items-center border border-primary/50 text-primary"><Sparkles size={14} strokeWidth={1.5} /></span>
              <p className="mb-4 font-mono text-[9px] tracking-[0.2em] text-primary">A MOMENT TO KEEP</p>
              <h2 className="break-words font-mono text-2xl font-medium leading-tight tracking-[-0.05em] text-foreground sm:text-4xl">{name.trim() || "Your name"}</h2>
              <div className="my-4 flex items-center justify-center gap-2 text-primary"><span className="h-px w-8 bg-border" /><span className="size-1 bg-primary" /><span className="h-px w-8 bg-border" /></div>
              <p className="font-mono text-[10px] leading-5 text-muted-foreground">For the little things you want to remember.</p>
            </div>
            <div className="relative flex items-end justify-between gap-3 font-mono text-[8px] tracking-[0.1em] text-muted-foreground">
              <span>MADE TO KEEP</span><span className="border border-primary/25 px-2 py-1 text-primary">PERSONAL · UNOFFICIAL</span>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 font-mono text-[10px] text-muted-foreground"><span className="text-primary">↳</span> The uploaded photo stays separate from this card.</p>
        </div>
      </section>

      <footer className="mt-10 flex items-center justify-between border-t border-border py-4 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
        <span>KEEPSAKE</span><span>LOCAL BY DESIGN <span className="text-primary">·</span> PERSONAL BY NATURE</span>
      </footer>
    </main>
  );
}
