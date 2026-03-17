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

  const copyToClipboard = (code: string) => {
    const url = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr className="border-b">
              <th className="p-2 text-left">Original</th>
              <th className="p-2 text-left">Short</th>
              <th className="p-2 text-left">Clicks</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No links yet
                </td>
              </tr>
            )}

            {links.map((link) => (

              <tr
                key={link.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >

                <td className="p-2">{link.original}</td>

                <td className="p-2">
                  <div className="flex items-center gap-2">

                    <a
                      href={`http://localhost:5000/${link.shortCode}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      {link.shortCode}
                    </a>

                    <button
                      onClick={() => copyToClipboard(link.shortCode)}
                      className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition"
                    >
                      Copy
                    </button>

                  </div>
                </td>

                <td className="p-2">{link.clicks}</td>

                <td className="p-2 flex gap-2">

                  <button
                    onClick={() => onAnalytics(link.shortCode)}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded text-xs"
                  >
                    Analytics
                  </button>

                  <button
                    onClick={() =>
                      setQrUrl(`http://localhost:5000/${link.shortCode}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                  >
                    QR
                  </button>

                  <button
                    onClick={() => onDelete(link.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ✅ QR MODAL (FIXED) */}
      {qrUrl && (
        <QRCodeModal
          url={qrUrl}
          onClose={() => setQrUrl(null)}
        />
      )}
    </>
  );
}