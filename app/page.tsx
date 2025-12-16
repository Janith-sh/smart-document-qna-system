"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    setLoading(true);
    setStatus("Uploading and processing PDF...");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("✅ " + data.message);
        setResult(data);
      } else {
        setStatus("❌ " + data.message);
      }
    } catch (error) {
      setStatus("❌ Error uploading file");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        📄 AI Document Q&A – Upload PDF
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select PDF Document
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        />

        {file && (
          <p className="text-sm text-gray-600 mb-4">
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Upload & Process PDF"}
        </button>

        {status && (
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
            <p className="font-medium">{status}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">Processing Results:</h3>
            <p className="text-sm text-gray-700">
              <strong>Text Length:</strong> {result.textLength} characters
            </p>
            {result.preview && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Preview:</p>
                <p className="text-xs text-gray-600 bg-white p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
                  {result.preview}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
