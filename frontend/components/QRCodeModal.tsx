"use client";

import { QRCodeCanvas } from "qrcode.react";
import { X, Download } from "lucide-react";

export default function QRCodeModal({ url, onClose }: any) {

  const downloadQR = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    if (!canvas) return;

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "qr-code.png";
    link.click();
  };

  return (

<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

  <div className="glass-strong w-[320px] rounded-3xl p-6 text-center relative">

    {/* DOWNLOAD (top-left) */}
    <button
      onClick={downloadQR}
      className="absolute top-3 left-3 p-1.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
    >
      <Download size={16} />
    </button>

    {/* CLOSE (top-right) */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-white hover:scale-110 transition"
    >
      <X size={16} />
    </button>

    <h2 className="text-lg font-semibold text-primary mb-4">
      QR Code
    </h2>

    <div className="flex justify-center mb-5">
      <div className="bg-white p-3 rounded-xl shadow">
        <QRCodeCanvas value={url} size={180} />
      </div>
    </div>

    <p className="text-xs text-secondary break-all px-2">
      {url}
    </p>

  </div>

</div>
  );
}