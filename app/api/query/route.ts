import { NextResponse } from "next/server";
import { pinecone, INDEX_NAME } from "@/lib/pinecone";
import { embeddingModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { message: "Query is required" },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const result = await embeddingModel.embedContent(query);
    const queryEmbedding = result.embedding.values;

    // Search Pinecone
    const index = pinecone.index(INDEX_NAME);
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    // Extract relevant text from results
    const results = searchResults.matches.map((match) => ({
      score: match.score,
      text: match.metadata?.text,
      filename: match.metadata?.filename,
      chunkIndex: match.metadata?.chunkIndex,
    }));

    return NextResponse.json({
      query,
      results,
      totalResults: searchResults.matches.length,
    });
  } catch (error) {
    console.error("Query Error:", error);
    return NextResponse.json(
      {
        message: "Failed to query documents",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
