# Smart Document Q&A System

A powerful document question-answering system built with Next.js, Google Gemini AI, and ChromaDB for intelligent vector search and semantic understanding.

## 🚀 Features

- **AI-Powered Embeddings**: Uses Google Gemini's `text-embedding-004` model to generate high-quality vector embeddings
- **Vector Database**: ChromaDB for efficient similarity search and storage
- **Modern Stack**: Built with Next.js 16, TypeScript, and Tailwind CSS
- **API-First Design**: RESTful API endpoints for document processing and querying

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 20.x or higher
- Python 3.9 or higher
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd doc-qna-ai
```

### 2. Install Node.js Dependencies

```bash
npm install --ignore-scripts
```

> **Note**: We use `--ignore-scripts` flag due to a known npm postinstall issue on some Windows systems.

### 3. Install Python Dependencies

```bash
pip install chromadb fastapi opentelemetry-instrumentation opentelemetry-instrumentation-fastapi
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Google Gemini API key.

## 🚀 Running the Application

### 1. Start ChromaDB Server

In a terminal window, run:

```bash
python -m uvicorn chromadb.app:app --host localhost --port 8000
```

The ChromaDB server will start on `http://localhost:8000`

### 2. Start Next.js Development Server

In another terminal window, run:

```bash
node node_modules/next/dist/bin/next dev
```

Or if npm scripts work on your system:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing the Embeddings

Visit `http://localhost:3000/api/test-embedding` to test the embedding functionality.

Expected output:
```json
{
  "message": "Embedding stored successfully!",
  "vectorLength": 768
}
```

This confirms:
- ✅ Gemini AI embeddings are working
- ✅ ChromaDB is storing vectors
- ✅ Next.js API is connected

## 📁 Project Structure

```
doc-qna-ai/
├── app/
│   ├── api/
│   │   ├── test-embedding/    # Test endpoint for embeddings
│   │   │   └── route.ts
│   │   └── tast-embedding/    # Legacy test endpoint
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── chroma.ts              # ChromaDB client configuration
│   ├── chunker.ts             # Document chunking utilities
│   └── gemini.ts              # Google Gemini AI configuration
├── public/
├── .env.local                 # Environment variables (not in git)
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 Key Components

### Gemini AI Configuration (`lib/gemini.ts`)

Configures two models:
- **gemini-1.5-flash**: For text generation
- **text-embedding-004**: For creating embeddings (768 dimensions)

### ChromaDB Client (`lib/chroma.ts`)

Manages vector database connections and operations:
- Collection name: `documents`
- Server: `http://localhost:8000`

### API Routes

- **`/api/test-embedding`**: Test endpoint for embedding generation and storage
- Demonstrates the full pipeline: text → embedding → storage

## 🛠️ Technologies Used

- **[Next.js 16](https://nextjs.org/)**: React framework with Turbopack
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Google Gemini AI](https://ai.google.dev/)**: Advanced language models
- **[ChromaDB](https://www.trychroma.com/)**: Open-source embedding database
- **[UUID](https://www.npmjs.com/package/uuid)**: Unique identifier generation

## 📦 Dependencies

### Node.js Packages
- `@google/generative-ai`: Google Gemini API client
- `chromadb`: ChromaDB JavaScript client
- `pdf-parse`: PDF document parsing
- `uuid`: UUID generation
- `next`, `react`, `react-dom`: Core framework

### Python Packages
- `chromadb`: Vector database server
- `fastapi`: API framework for ChromaDB
- `uvicorn`: ASGI server
- `opentelemetry-*`: Observability tools

## 🐛 Troubleshooting

### ChromaDB Connection Issues

If you see connection errors:
1. Ensure ChromaDB server is running on port 8000
2. Check that no firewall is blocking localhost connections
3. Verify Python dependencies are installed

### npm Install Errors

If `npm install` fails with postinstall errors:
```bash
npm install --ignore-scripts
```

### Next.js Won't Start

Try running directly with node:
```bash
node node_modules/next/dist/bin/next dev
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Keep your Gemini API key secure
- Use environment variables for all sensitive data

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js, Google Gemini AI, and ChromaDB
