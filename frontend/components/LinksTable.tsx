"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import QRCodeModal from "./QRCodeModal";

type Props = {
  links: any[];
  onAnalytics: (code: string) => void;
  onDelete: (id: number) => void;
};

export default function LinksTable({
  links,
  onAnalytics,
  onDelete,
}: Props) {

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const copyToClipboard = (code: string) => {
    const url = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-black/5 dark:bg-white/10 text-secondary">
            <tr>
              <th className="p-3 text-left">Original</th>
              <th className="p-3 text-left">Short</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">
                  No links yet
                </td>
              </tr>
            )}

            {links.map((link) => (

              <tr
                key={link.id}
                className="border-t border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              >

                <td className="p-3 text-primary truncate max-w-xs">
                  {link.original}
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">

                    <a
                      href={`http://localhost:5000/${link.shortCode}`}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {link.shortCode}
                    </a>

                    <button
                      onClick={() => copyToClipboard(link.shortCode)}
                      className="text-xs glass px-2 py-1 rounded-md text-stone-700 dark:text-white"
                    >
                      Copy
                    </button>

                  </div>
                </td>

                <td className="p-3 text-primary">
                  {link.clicks}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => onAnalytics(link.shortCode)}
                    className="glass px-3 py-1 rounded-md text-xs text-stone-700 dark:text-white"
                  >
                    Analytics
                  </button>

                  <button
                    onClick={() =>
                      setQrUrl(`http://localhost:5000/${link.shortCode}`)
                    }
                    className="px-3 py-1 rounded-md text-xs glass text-stone-700 dark:text-white"
                  >
                    QR
                  </button>

                  <button
                    onClick={() => setDeleteId(link.id)}
                    className="px-3 py-1 rounded-md text-xs bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {qrUrl && (
        <QRCodeModal
          url={qrUrl}
          onClose={() => setQrUrl(null)}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="glass-strong rounded-2xl p-6 w-[320px] text-center">

            <h3 className="text-primary font-semibold mb-2">
              Delete Link?
            </h3>

            <p className="text-secondary text-sm mb-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg bg-black/10 dark:bg-white/10 text-primary"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete(deleteId);
                  setDeleteId(null);
                  toast.success("Link deleted");
                }}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}