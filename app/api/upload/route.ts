import { NextResponse } from "next/server";
import { pinecone, INDEX_NAME } from "@/lib/pinecone";
import { generateEmbedding } from "@/lib/gemini";
import { v4 as uuidv4 } from "uuid";
import { extractTextFromPDF } from "@/lib/pdfReader";

// Simple text chunker function
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  // Ensure we have valid text
  if (!text || text.length === 0) {
    return [];
  }
  
  // Prevent infinite loop if overlap >= chunkSize
  const step = Math.max(chunkSize - overlap, 1);
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end).trim();
    
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    
    start += step;
    
    // Safety check to prevent infinite loops
    if (chunks.length > 10000) {
      console.warn("Too many chunks, stopping at 10000");
      break;
    }
  }
  
  return chunks;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    // Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    // Ensure text is a string
    const textString = typeof text === 'string' ? text : String(text || '');

    if (!textString || textString.trim().length === 0) {
      return NextResponse.json(
        { message: "No text content found in PDF" },
        { status: 400 }
      );
    }

    // Chunk the text
    const chunks = chunkText(textString);

    // Get Pinecone index
    const index = pinecone.index(INDEX_NAME);

    // Generate embeddings and store in Pinecone
    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Generate embedding using Gemini REST API
      const embedding = await generateEmbedding(chunk);
      
      vectors.push({
        id: uuidv4(),
        values: embedding,
        metadata: {
          text: chunk,
          filename: file.name,
          chunkIndex: i,
        },
      });
    }

    // Upsert vectors to Pinecone
    await index.upsert(vectors);

    return NextResponse.json({
      message: "PDF processed and stored successfully",
      filename: file.name,
      textLength: textString.length,
      chunksStored: chunks.length,
      preview: textString.substring(0, 500),
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to process PDF", 
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
