import { ChromaClient } from "chromadb";

export const chroma = new ChromaClient({
  path: "http://localhost:8000",
});

export const COLLECTION_NAME = "documents";
