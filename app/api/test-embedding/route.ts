import { NextResponse } from "next/server";
import { embeddingModel } from "@/lib/gemini";
import { pinecone, INDEX_NAME } from "@/lib/pinecone";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const text = "Vector databases store embeddings";

  // Generate embedding
  const embeddingResult = await embeddingModel.embedContent(text);
  const embedding = embeddingResult.embedding.values;

  // Get Pinecone index
  const index = pinecone.index(INDEX_NAME);

  // Store in vector DB
  await index.upsert([{
    id: uuidv4(),
    values: embedding,
    metadata: { text },
  }]);

  return NextResponse.json({
    message: "Embedding stored successfully!",
    vectorLength: embedding.length,
  });
}
