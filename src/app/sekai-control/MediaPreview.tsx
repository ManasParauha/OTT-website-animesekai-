"use client";

type MediaPreviewProps = {
  label: string;
  type: "image" | "video";
  url?: string;
};

export default function MediaPreview({ label, type, url }: MediaPreviewProps) {
  const previewUrl = url?.trim();

  if (!previewUrl) {
    return null;
  }

  return (
    <div className="grid gap-2 rounded-md border border-border bg-background p-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold">{label} Preview</p>
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Open file
        </a>
      </div>

      {type === "image" ? (
        <img
          src={previewUrl}
          alt={`${label} preview`}
          className="aspect-video max-h-72 w-full rounded-md border border-border object-cover"
        />
      ) : (
        <video
          src={previewUrl}
          controls
          preload="metadata"
          className="aspect-video max-h-80 w-full rounded-md border border-border bg-black"
        />
      )}
    </div>
  );
}

