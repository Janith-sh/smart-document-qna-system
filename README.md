# Smart Document Q&A System

A powerful document question-answering system built with Next.js, Google Gemini AI, and Pinecone for intelligent vector search and semantic understanding.

## 🚀 Features

- **AI-Powered Embeddings**: Uses Google Gemini's `text-embedding-004` model to generate high-quality vector embeddings
- **Vector Database**: Pinecone for efficient similarity search and storage
- **Modern Stack**: Built with Next.js 16, TypeScript, and Tailwind CSS
- **API-First Design**: RESTful API endpoints for document processing and querying

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 20.x or higher
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Pinecone API key ([Get one here](https://www.pinecone.io/))

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

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
```

Replace with your actual API keys from Google Gemini and Pinecone.

## 🚀 Running the Application

### Start Next.js Development Server

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
- ✅ Pinecone is storing vectors
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
│   ├── pinecone.ts            # Pinecone client configuration
│   ├── chunker.ts             # Document chunking utilities
│   ├── pdfReader.ts           # PDF document reading utilities
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

### Pinecone Client (`lib/pinecone.ts`)

Manages vector database connections and operations:
- Index name: `documents`
- Cloud-based vector storage

### API Routes

- **`/api/test-embedding`**: Test endpoint for embedding generation and storage
- Demonstrates the full pipeline: text → embedding → storage

## 🛠️ Technologies Used

- **[Next.js 16](https://nextjs.org/)**: React framework with Turbopack
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Google Gemini AI](https://ai.google.dev/)**: Advanced language models
- **[Pinecone](https://www.pinecone.io/)**: Scalable vector database
- **[unpdf](https://www.npmjs.com/package/unpdf)**: PDF document parsing
- **[UUID](https://www.npmjs.com/package/uuid)**: Unique identifier generation

## 📦 Dependencies

### Node.js Packages
- `@google/generative-ai`: Google Gemini API client
- `@pinecone-database/pinecone`: Pinecone vector database client
- `unpdf`: PDF document parsing
- `uuid`: UUID generation
- `lucide-react`: Icon library
- `next`, `react`, `react-dom`: Core framework

## 🐛 Troubleshooting

### Pinecone Connection Issues

If you see connection errors:
1. Verify your Pinecone API key is correct in `.env.local`
2. Ensure you have created an index named `documents` in your Pinecone dashboard
3. Check your internet connection

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
- Keep your Gemini and Pinecone API keys secure
- Use environment variables for all sensitive data

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js, Google Gemini AI, and Pinecone
