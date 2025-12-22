import { NextResponse } from "next/server";
import { generateEmbedding, generateContent } from "@/lib/gemini";
import { pinecone, INDEX_NAME } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // 1. Embed the question using REST API
    const queryVector = await generateEmbedding(question);

    // 2. Query Pinecone
    const index = pinecone.Index(INDEX_NAME);
    const searchResults = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    // 3. Build context from retrieved chunks
    const context = searchResults.matches
      ?.map((m) => m.metadata?.text)
      .join("\n\n");

    if (!context) {
      return NextResponse.json({
        answer: "I don't know. No relevant information found. Please upload a document first.",
      });
    }

    // 4. Ask Gemini with strict RAG prompt
    const prompt = `
You are an assistant answering questions ONLY using the context below.
If the answer is not in the context, say "I don't know".

Context:
${context}

Question:
${question}
`;

    const answer = await generateContent(prompt);

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    );
  }
}
