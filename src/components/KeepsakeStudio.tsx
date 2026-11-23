import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_NAME_LENGTH = 48;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function drawKeepsake(name: string, canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return null;

  const scale = 1.5;
  canvas.width = 1600 * scale;
  canvas.height = 1000 * scale;
  context.scale(scale, scale);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, 1600, 1000);
  context.strokeStyle = "#262626";
  context.lineWidth = 2;
  context.strokeRect(36, 36, 1528, 928);

  context.strokeStyle = "#8d8d8d";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(36, 150); context.lineTo(36, 36); context.lineTo(150, 36);
  context.moveTo(1450, 36); context.lineTo(1564, 36); context.lineTo(1564, 150);
  context.moveTo(36, 850); context.lineTo(36, 964); context.lineTo(150, 964);
  context.moveTo(1450, 964); context.lineTo(1564, 964); context.lineTo(1564, 850);
  context.stroke();

  context.textBaseline = "middle";
  context.fillStyle = "#ffffff";
  context.font = '500 22px "JetBrains Mono Variable", monospace';
  context.textAlign = "left";
  context.fillText("KEEPSAKE", 96, 105);
  context.fillStyle = "#7a7a7a";
  context.textAlign = "right";
  context.font = '400 16px "JetBrains Mono Variable", monospace';
  context.fillText("A PERSONAL MOMENT", 1504, 105);

  context.strokeStyle = "#8d8d8d";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(800, 280, 28, 0, Math.PI * 2);
  context.moveTo(800, 265); context.lineTo(800, 295);
  context.moveTo(785, 280); context.lineTo(815, 280);
  context.stroke();

  context.fillStyle = "#8d8d8d";
  context.textAlign = "center";
  context.font = '500 17px "JetBrains Mono Variable", monospace';
  context.letterSpacing = "5px";
  context.fillText("A MOMENT TO KEEP", 800, 370);
  context.letterSpacing = "0px";

  let fontSize = 82;
  context.font = `500 ${fontSize}px "JetBrains Mono Variable", monospace`;
  while (context.measureText(name).width > 1320 && fontSize > 32) {
    fontSize -= 2;
    context.font = `500 ${fontSize}px "JetBrains Mono Variable", monospace`;
  }
  context.fillStyle = "#ffffff";
  context.fillText(name, 800, 505, 1320);

  context.strokeStyle = "#3a3a3a";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(680, 555); context.lineTo(765, 555);
  context.moveTo(835, 555); context.lineTo(920, 555);
  context.stroke();
  context.fillStyle = "#8d8d8d";
  context.beginPath();
  context.arc(800, 555, 4, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#b7b7b7";
  context.font = '400 20px "JetBrains Mono Variable", monospace';
  context.fillText("For the little things you want to remember.", 800, 620);
  context.fillStyle = "#7a7a7a";
  context.font = '400 14px "JetBrains Mono Variable", monospace';
  context.letterSpacing = "2px";
  context.fillText("PERSONAL KEEPSAKE · NOT OFFICIAL DOCUMENTATION", 800, 890);
  context.letterSpacing = "0px";

  return context;
}

export default function KeepsakeStudio() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function downloadOriginal() {
    if (!photo) return;
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = photo.file.name;
    link.click();
  }

  async function downloadKeepsake() {
    const cleanName = name.trim();
    if (!cleanName) return;

    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    const context = drawKeepsake(cleanName, canvas);
    if (!context) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "keepsake.png";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-8 sm:px-8">
      <header className="flex h-[68px] items-center justify-between border-b border-border">
        <a href="#top" className="flex items-center gap-3 font-mono text-sm font-medium tracking-tight text-foreground">
          <span className="grid size-8 place-items-center border border-border text-foreground">K</span>
          <span>Keepsake</span>
        </a>
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground">PRIVATE / LOCAL</span>
      </header>

      <section id="top" className="grid gap-5 py-10 sm:gap-8 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-muted-foreground">
            <span className="size-1.5 bg-foreground" /> A PERSONAL KEEPSAKE STUDIO
          </p>
          <h1 className="font-mono text-4xl font-medium leading-[1.08] tracking-[-0.07em] text-foreground sm:text-5xl">
            Keep a moment.<br /><span className="text-primary">Make it yours.</span>
          </h1>
        </div>
        <p className="max-w-sm font-sans text-sm leading-6 text-muted-foreground lg:pb-1">
          Your photo stays original. Your name belongs on a keepsake of its own.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(300px,0.76fr)_minmax(0,1.24fr)] lg:gap-12" aria-label="Keepsake creator">
        <div className="border border-border bg-card p-5 sm:p-6">
          <div className="mb-7 flex items-start gap-3">
            <span className="pt-0.5 font-mono text-[10px] tracking-widest text-muted-foreground">01</span>
            <div>
              <h2 className="font-mono text-sm font-medium text-foreground">Make it yours</h2>
              <p className="mt-1 font-sans text-xs text-muted-foreground">One name. One moment.</p>
            </div>
          </div>

          <label htmlFor="name" className="mb-2 block font-mono text-[9px] tracking-[0.12em] text-muted-foreground">YOUR NAME</label>
          <Input
            id="name"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Type your name"
            aria-describedby="name-help"
          />
          <div id="name-help" className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>As you’d like it shown</span><span>{name.length}/{MAX_NAME_LENGTH}</span>
          </div>

          <div className="mb-2 mt-7 flex items-center justify-between">
            <label htmlFor="photo" className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">A PHOTO <span className="text-muted-foreground">· OPTIONAL</span></label>
            {photo && <button onClick={removePhoto} className="font-mono text-[9px] tracking-widest text-muted-foreground transition-colors hover:text-foreground" type="button">REMOVE</button>}
          </div>
          <label htmlFor="photo" className="group flex min-h-16 cursor-pointer items-center gap-3 border border-dashed border-border bg-background px-3 py-3 transition-colors hover:border-primary">
            <span className="grid size-9 shrink-0 place-items-center border border-border text-primary transition-colors group-hover:border-primary">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="0" /><circle cx="8.5" cy="9" r="1.5" /><path d="m20.5 15-5-5L6 19" /></svg>
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[11px] text-foreground">{photo ? "Change photo" : "Choose a photo"}</span>
              <span className="mt-1 block font-sans text-[10px] text-muted-foreground">Stays on this device · JPG, PNG, WebP</span>
            </span>
            <input ref={fileInputRef} id="photo" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
          </label>

          {photo && (
            <motion.div
              className="photo-preview mt-4 border border-border p-2"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[9px] text-muted-foreground">
                <span className="tracking-[0.1em]">ORIGINAL · UNCHANGED</span>
                <span className="max-w-[55%] truncate text-right" title={photo.file.name}>{photo.file.name}</span>
              </div>
              <img src={photo.url} alt="Original uploaded photo, unchanged" className="h-32 w-full object-contain outline outline-1 -outline-offset-1 outline-white/10" />
              <button type="button" onClick={downloadOriginal} className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-foreground transition-colors hover:text-primary">
                Download original <span aria-hidden="true">↗</span>
              </button>
            </motion.div>
          )}

          <div className="mt-6 flex gap-2 border-l border-primary px-3 py-2.5 font-sans text-[11px] leading-5 text-muted-foreground">
            <span className="mt-0.5 shrink-0 font-mono text-primary" aria-hidden="true">i</span>
            Your image is never changed or uploaded. The name stays on a separate keepsake.
          </div>
          <Button className="mt-4 w-full justify-between px-4" onClick={downloadKeepsake} disabled={!name.trim()}>
            <span>Download keepsake</span><span aria-hidden="true">↓</span>
          </Button>
          <p className="mt-2 text-center font-mono text-[9px] tracking-[0.1em] text-muted-foreground">PERSONAL · NOT OFFICIAL DOCUMENTATION</p>
        </div>

        <div className="min-w-0 self-center">
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
            <span>02 / PREVIEW</span><span className="flex items-center gap-1.5 text-foreground"><span className="size-1.5 bg-foreground" /> LIVE</span>
          </div>
          <div className="keepsake-card relative flex aspect-[1.58] max-[420px]:aspect-auto max-[420px]:min-h-72 flex-col justify-between overflow-hidden border border-border bg-background p-5 sm:p-8">
            <div className="pointer-events-none absolute inset-2 border border-border/70" />
            <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full border border-border" />
            <div className="relative flex items-start justify-between font-mono text-[9px] tracking-[0.12em]">
              <span className="text-foreground">KEEPSAKE<span className="text-primary">/</span>01</span>
              <span className="text-muted-foreground">A PERSONAL MOMENT</span>
            </div>
            <div className="relative my-auto px-2 py-7 text-center">
              <span className="mx-auto mb-4 grid size-8 place-items-center border border-border text-foreground" aria-hidden="true"><svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="10" cy="10" r="6.5" /><path d="M10 6v8M6 10h8" /></svg></span>
              <p className="mb-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">A MOMENT TO KEEP</p>
              <h2 className="break-words font-mono text-2xl font-medium leading-tight tracking-[-0.05em] text-foreground sm:text-4xl">{name.trim() || "Your name"}</h2>
              <div className="my-4 flex items-center justify-center gap-2"><span className="h-px w-8 bg-border" /><span className="size-1 bg-foreground" /><span className="h-px w-8 bg-border" /></div>
              <p className="font-sans text-[11px] leading-5 text-muted-foreground">For the little things you want to remember.</p>
            </div>
            <div className="relative flex items-end justify-between gap-3 font-mono text-[8px] tracking-[0.1em] text-muted-foreground">
              <span>MADE TO KEEP</span><span className="border border-border px-2 py-1 text-foreground">PERSONAL · UNOFFICIAL</span>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 font-sans text-[11px] text-muted-foreground"><span className="font-mono text-foreground" aria-hidden="true">↳</span> The uploaded image remains separate from this card.</p>
        </div>
      </section>

      <footer className="mt-10 flex items-center justify-between border-t border-border py-4 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
        <span>KEEPSAKE</span><span>LOCAL BY DESIGN · PERSONAL BY NATURE</span>
      </footer>
    </main>
  );
}
