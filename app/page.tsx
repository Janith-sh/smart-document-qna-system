"use client";

import { useState } from "react";
import { Upload, FileText, Send, Loader2, CheckCircle, XCircle, Sparkles, FileSearch } from "lucide-react";

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

const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

const askQuestion = async () => {
  if (!question.trim()) {
    setAnswer("Please enter a question first.");
    return;
  }

  setAnswer("Thinking...");
  
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    
    if (res.ok) {
      setAnswer(data.answer || "No answer received.");
    } else {
      setAnswer(`Error: ${data.error || "Failed to get answer"}`);
    }
  } catch (error) {
    setAnswer("Error: Failed to connect to the server.");
    console.error(error);
  }
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Smart Document Q&A
          </h1>
          <p className="text-gray-300 text-lg">
            Upload your PDF documents and ask questions powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-700 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-900/50 rounded-lg">
                <FileText className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">Upload Document</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 font-semibold text-gray-700 text-sm">
                  Select PDF Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-teal-600 file:to-cyan-600 file:text-white hover:file:from-teal-700 hover:file:to-cyan-700 file:cursor-pointer file:transition-all file:shadow-md cursor-pointer"
                  />
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-4 bg-teal-900/30 rounded-xl border border-teal-700">
                  <FileText className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload & Process PDF
                  </>
                )}
              </button>

              {status && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${status.includes('✅') ? 'bg-emerald-900/30 border-emerald-700' : 'bg-red-900/30 border-red-700'}`}>
                  {status.includes('✅') ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium text-gray-200">{status.replace(/[✅❌]/g, '').trim()}</p>
                </div>
              )}

              {result && (
                <div className="p-5 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-700">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-emerald-300">Processing Complete</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Text Length:</strong> {result.textLength.toLocaleString()} characters
                  </p>
                  {result.preview && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-400 mb-2">Document Preview:</p>
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 max-h-40 overflow-y-auto">
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {result.preview}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Q&A Section */}
          <div className="bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-700 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-900/50 rounded-lg">
                <FileSearch className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">Ask Questions</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 font-semibold text-gray-300 text-sm">
                  Your Question
                </label>
                <div className="relative">
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask something about the uploaded document..."
                    onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-gray-200 placeholder-gray-500"
                  />
                </div>
              </div>

              <button
                onClick={askQuestion}
                disabled={!question.trim() || answer === "Thinking..."}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {answer === "Thinking..." ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Ask Question
                  </>
                )}
              </button>

              {answer && answer !== "Thinking..." && (
                <div className="p-5 bg-gradient-to-br from-cyan-900/30 to-teal-900/30 rounded-xl border border-cyan-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-cyan-300">AI Answer</h3>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
