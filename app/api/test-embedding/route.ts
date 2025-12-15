import { NextResponse } from "next/server";
import { embeddingModel } from "@/lib/gemini";
import { chroma, COLLECTION_NAME } from "@/lib/chroma";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const text = "Vector databases store embeddings";

  // Generate embedding
  const embeddingResult = await embeddingModel.embedContent(text);
  const embedding = embeddingResult.embedding.values;

  // Get or create collection
  const collection = await chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
  });

  // Store in vector DB
  await collection.add({
    ids: [uuidv4()],
    embeddings: [embedding],
    documents: [text],
  });

  return NextResponse.json({
    message: "Embedding stored successfully!",
    vectorLength: embedding.length,
  });
}
