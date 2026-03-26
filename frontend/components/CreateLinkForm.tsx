"use client";

type Props = {
  url: string;
  setUrl: (v: string) => void;
  customCode: string;
  setCustomCode: (v: string) => void;
  expiresAt: string;
  setExpiresAt: (v: string) => void;
  onSubmit: () => void;
};

export default function CreateLinkForm({
  url,
  setUrl,
  customCode,
  setCustomCode,
  expiresAt,
  setExpiresAt,
  onSubmit,
}: Props) {
  return (
    <div className="glass-card p-6 rounded-2xl">

      <h2 className="text-lg font-semibold text-primary mb-4">
        Create New Short Link
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Enter full URL..."
          className="glass input-glass rounded-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Custom code (optional)"
          className="glass input-glass rounded-lg"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />

        <input
          type="datetime-local"
          className="glass input-glass rounded-lg"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />

        <button
          onClick={onSubmit}
          className="btn-glass font-medium"
        >
          Generate
        </button>

      </div>
    </div>
  );
}