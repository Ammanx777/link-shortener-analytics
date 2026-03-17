"use client";

import { QRCodeCanvas } from "qrcode.react";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-[300px]">

        <h2 className="text-lg font-semibold mb-4 text-center">
          QR Code
        </h2>

        <div className="flex justify-center mb-4">
          <QRCodeCanvas value={url} size={180} />
        </div>

        <p className="text-xs text-gray-500 text-center break-all mb-4">
          {url}
        </p>

        <button
          onClick={downloadQR}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mb-2"
        >
          Download
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-800 text-white py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  );
}