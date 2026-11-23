import { useEffect, useRef, useState, type ChangeEvent, type DragEvent as ReactDragEvent, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_NAME_LENGTH = 48;
const FONT_FAMILIES = {
  sans: '"Geist Variable", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono Variable", monospace',
  script: '"Brush Script MT", "Segoe Script", cursive',
} as const;

type FontStyle = keyof typeof FONT_FAMILIES;
type Photo = { file: File; url: string; width: number; height: number };
type Position = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function KeepsakeStudio() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [fontStyle, setFontStyle] = useState<FontStyle>("sans");
  const [fontWeight, setFontWeight] = useState(600);
  const [fontScale, setFontScale] = useState(1.4);
  const [textColor, setTextColor] = useState("#171717");
  const [position, setPosition] = useState<Position>({ x: 50, y: 62 });
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDisplayWidth, setImageDisplayWidth] = useState(0);
  const uploadGeneration = useRef(0);
  const draggingPointer = useRef<number | null>(null);
  const pointerOffset = useRef<Position>({ x: 0, y: 0 });
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    const observer = new ResizeObserver((entries) => {
      setImageDisplayWidth(entries[0]?.contentRect.width ?? image.getBoundingClientRect().width);
    });
    observer.observe(image);
    setImageDisplayWidth(image.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [photo]);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.url);
    };
  }, [photo]);

  async function loadPhoto(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    const generation = ++uploadGeneration.current;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;

    try {
      await image.decode();
      if (generation !== uploadGeneration.current) {
        URL.revokeObjectURL(url);
        return;
      }
      setPhoto({ file, url, width: image.naturalWidth, height: image.naturalHeight });
      setPosition({ x: 50, y: 62 });
      setError("");
    } catch {
      URL.revokeObjectURL(url);
      if (generation === uploadGeneration.current) {
        setError("That image could not be opened. Try another file.");
      }
    }
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    void loadPhoto(file);
  }

  function handleDrop(event: ReactDragEvent<HTMLDivElement>) {
    event.preventDefault();
    void loadPhoto(event.dataTransfer.files[0]);
  }

  function removePhoto() {
    uploadGeneration.current += 1;
    setPhoto(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function movePosition(clientX: number, clientY: number) {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0 || bounds.height === 0) return;
    setPosition({
      x: clamp(((clientX - bounds.left) / bounds.width) * 100, 3, 97),
      y: clamp(((clientY - bounds.top) / bounds.height) * 100, 3, 97),
    });
  }

  function handleStagePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget || event.target === event.currentTarget.querySelector("img")) {
      movePosition(event.clientX, event.clientY);
    }
  }

  function handleNamePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const bounds = stageRef.current?.getBoundingClientRect();
    if (bounds) {
      pointerOffset.current = {
        x: event.clientX - (bounds.left + (position.x / 100) * bounds.width),
        y: event.clientY - (bounds.top + (position.y / 100) * bounds.height),
      };
    }
    draggingPointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function handleNamePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (draggingPointer.current === event.pointerId) {
      movePosition(event.clientX - pointerOffset.current.x, event.clientY - pointerOffset.current.y);
    }
  }

  function handleNamePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (draggingPointer.current !== event.pointerId) return;
    draggingPointer.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const delta = event.shiftKey ? 2 : 0.5;
    const moves: Partial<Record<string, Position>> = {
      ArrowLeft: { x: -delta, y: 0 },
      ArrowRight: { x: delta, y: 0 },
      ArrowUp: { x: 0, y: -delta },
      ArrowDown: { x: 0, y: delta },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setPosition((current) => ({
      x: clamp(current.x + move.x, 3, 97),
      y: clamp(current.y + move.y, 3, 97),
    }));
  }

  async function downloadEditedImage() {
    if (!photo || !name.trim()) return;
    setLoading(true);
    setError("");
    let image: ImageBitmap | null = null;

    try {
      await document.fonts.ready;
      image = await createImageBitmap(photo.file);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable.");

      context.drawImage(image, 0, 0);
      const cleanName = name.trim();
      let size = (image.width * fontScale) / 100;
      const family = FONT_FAMILIES[fontStyle];
      await document.fonts.load(`${fontWeight} ${size}px ${family}`, cleanName);

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = textColor;
      context.font = `${fontWeight} ${size}px ${family}`;
      const maxTextWidth = image.width * 0.92;
      const measuredWidth = context.measureText(cleanName).width;
      if (measuredWidth > maxTextWidth) {
        size *= maxTextWidth / measuredWidth;
        context.font = `${fontWeight} ${size}px ${family}`;
      }
      context.fillText(cleanName, (position.x / 100) * image.width, (position.y / 100) * image.height);

      const { promise, resolve } = Promise.withResolvers<Blob | null>();
      canvas.toBlob(resolve, "image/png");
      const blob = await promise;
      if (!blob) throw new Error("The edited image could not be created.");
      const baseName = photo.file.name.replace(/\.[^.]+$/, "") || "image";
      saveBlob(blob, `${baseName}-keepsake.png`);
    } catch {
      setError("Could not export this image. Try a smaller JPG, PNG, or WebP file.");
    } finally {
      image?.close();
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-8 sm:px-8">
      <header className="flex h-[68px] items-center justify-between border-b border-border">
        <a href="#top" className="flex items-center gap-3 font-sans text-sm font-medium tracking-tight text-foreground">
          <img src="/keepsake-mark.svg" width="32" height="32" alt="" className="size-8" />
          <span>Keepsake</span>
        </a>
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground">PRIVATE / LOCAL</span>
      </header>

      <section id="top" className="grid gap-4 py-9 sm:grid-cols-[1fr_auto] sm:items-end sm:py-12">
        <div>
          <p className="mb-3 font-mono text-[9px] tracking-[0.16em] text-muted-foreground">A PERSONAL IMAGE EDITOR</p>
          <h1 className="font-sans text-3xl font-medium leading-tight tracking-[-0.045em] text-foreground sm:text-4xl">
            Put your name<br className="sm:hidden" /> where it belongs.
          </h1>
        </div>
        <p className="max-w-sm font-sans text-xs leading-5 text-muted-foreground">
          Add text directly to your image. Drag it into place and download the full-resolution result.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]" aria-label="Image editor">
        <aside className="border border-border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block font-mono text-[9px] tracking-[0.12em] text-muted-foreground">NAME</label>
            <Input
              id="name"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Type your name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="font-style" className="mb-2 block font-mono text-[9px] tracking-[0.12em] text-muted-foreground">TYPEFACE</label>
            <select
              id="font-style"
              value={fontStyle}
              onChange={(event) => setFontStyle(event.target.value as FontStyle)}
              className="h-10 w-full border border-input bg-input px-3 font-sans text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
            >
              <option value="sans">Sans</option>
              <option value="serif">Serif</option>
              <option value="mono">Monospace</option>
              <option value="script">Script</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="font-size" className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">SIZE</label>
              <span className="font-mono text-[10px] text-muted-foreground">{fontScale.toFixed(1)}%</span>
            </div>
            <input
              id="font-size"
              type="range"
              min="0.8"
              max="8"
              step="0.1"
              value={fontScale}
              onChange={(event) => setFontScale(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="font-weight" className="mb-2 block font-mono text-[9px] tracking-[0.12em] text-muted-foreground">WEIGHT</label>
            <select
              id="font-weight"
              value={fontWeight}
              onChange={(event) => setFontWeight(Number(event.target.value))}
              className="h-10 w-full border border-input bg-input px-3 font-sans text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
            >
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <label htmlFor="text-color" className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">TEXT COLOR</label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase text-muted-foreground">{textColor}</span>
              <input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(event) => setTextColor(event.target.value)}
                aria-label="Choose name color"
                className="size-8 cursor-pointer border border-border bg-transparent p-0.5"
              />
            </div>
          </div>

          <div className="mb-5 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">PLACEMENT</span>
              <button
                type="button"
                onClick={() => setPosition({ x: 50, y: 62 })}
                className="font-mono text-[9px] text-muted-foreground transition-colors hover:text-foreground"
              >
                RESET
              </button>
            </div>
            <p className="mt-2 font-sans text-[11px] leading-5 text-muted-foreground">Drag the name on your image. Arrow keys move it precisely.</p>
          </div>

          <div className="mb-5">
            <label htmlFor="photo" className="mb-2 block font-mono text-[9px] tracking-[0.12em] text-muted-foreground">{photo ? "CHANGE IMAGE" : "YOUR IMAGE"}</label>
            <label htmlFor="photo" className="group flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-dashed border-border px-3 py-3 font-mono text-[10px] text-foreground transition-colors hover:border-primary">
              <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 15v5h16v-5" /></svg>
              <span>{photo ? "Choose another image" : "Choose an image"}</span>
              <input ref={fileInputRef} id="photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handlePhotoChange} />
            </label>
            <p className="mt-2 font-sans text-[10px] text-muted-foreground">JPG, PNG, WebP · processed on this device</p>
          </div>

          <Button className="w-full justify-between px-4" onClick={downloadEditedImage} disabled={!photo || !name.trim() || loading}>
            <span>{loading ? "Preparing image…" : "Download edited image"}</span><span aria-hidden="true">↓</span>
          </Button>
          {photo && (
            <button
              type="button"
              onClick={() => {
                const link = document.createElement("a");
                link.href = photo.url;
                link.download = photo.file.name;
                link.click();
              }}
              className="mt-3 w-full text-center font-mono text-[9px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Download original unchanged
            </button>
          )}
          {error && <p role="alert" className="mt-3 font-sans text-xs leading-5 text-red-300">{error}</p>}
        </aside>

        <section className="min-w-0" aria-label="Image preview">
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
            <span>PREVIEW</span>
            {photo && <span>{photo.width.toLocaleString()} × {photo.height.toLocaleString()} PX</span>}
          </div>

          {!photo ? (
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="grid min-h-[340px] place-items-center border border-dashed border-border bg-card p-8 text-center sm:min-h-[460px]"
            >
              <div>
                <div className="mx-auto mb-4 grid size-12 place-items-center border border-border text-muted-foreground">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" /><circle cx="8.5" cy="9" r="1.5" /><path d="m20.5 15-5-5L6 19" /></svg>
                </div>
                <p className="font-sans text-sm text-foreground">Choose an image to start</p>
                <p className="mt-1 font-sans text-xs text-muted-foreground">or drop it here · nothing is uploaded</p>
              </div>
            </div>
          ) : (
            <div className="border border-border bg-card p-3 sm:p-5">
              <div className="mb-3 flex min-w-0 items-center justify-between gap-3 font-mono text-[9px] text-muted-foreground">
                <span className="truncate" title={photo.file.name}>{photo.file.name}</span>
                <button type="button" onClick={removePhoto} className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">REMOVE</button>
              </div>
              <div className="overflow-auto text-center">
                <div
                  ref={stageRef}
                  onPointerDown={handleStagePointerDown}
                  className="relative mx-auto inline-block max-w-full touch-none select-none align-top"
                >
                  <img
                    ref={imageRef}
                    src={photo.url}
                    alt="Uploaded image with name overlay preview"
                    draggable={false}
                    className="block max-h-[68vh] max-w-full object-contain"
                  />
                  {name.trim() && (
                    <button
                      type="button"
                      aria-label={`Name overlay, at ${Math.round(position.x)} percent across and ${Math.round(position.y)} percent down. Drag to move; use arrow keys for precise placement.`}
                      onPointerDown={handleNamePointerDown}
                      onPointerMove={handleNamePointerMove}
                      onPointerUp={handleNamePointerUp}
                      onPointerCancel={handleNamePointerUp}
                      onKeyDown={handleNameKeyDown}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab whitespace-nowrap border border-transparent bg-transparent px-[0.18em] py-[0.08em] leading-none text-center outline-none hover:border-dashed hover:border-white/50 focus-visible:border-dashed focus-visible:border-white/70 focus-visible:ring-2 focus-visible:ring-white ${dragging ? "cursor-grabbing" : ""}`}
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        color: textColor,
                        fontFamily: FONT_FAMILIES[fontStyle],
                        fontSize: `${(imageDisplayWidth * fontScale) / 100}px`,
                        fontWeight,
                      }}
                    >
                      {name.trim()}
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-center font-sans text-[10px] text-muted-foreground">
                {name.trim() ? "Drag the name to position it on the image." : "Enter a name to see it on your image."}
              </p>
            </div>
          )}
          <p className="mt-3 font-sans text-[11px] text-muted-foreground">The source file is never changed. The downloaded PNG keeps its original pixel dimensions.</p>
        </section>
      </section>

      <footer className="mt-10 flex items-center justify-between border-t border-border py-4 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
        <span className="flex items-center gap-2"><img src="/keepsake-mark.svg" width="18" height="18" alt="" className="size-[18px]" /> KEEPSAKE</span>
        <span>LOCAL BY DESIGN</span>
      </footer>
    </main>
  );
}
