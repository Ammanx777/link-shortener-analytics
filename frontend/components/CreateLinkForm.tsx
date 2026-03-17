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
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8">

    <h2 className="text-lg font-semibold mb-4">
      Create New Short Link
    </h2>

    <div className="grid md:grid-cols-4 gap-4">

      <input
        type="text"
        placeholder="Enter full URL..."
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        type="text"
        placeholder="Custom code (optional)"
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
      />

      <input
        type="datetime-local"
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />

      <button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition"
      >
        Generate
      </button>

    </div>
  </div>
    );}