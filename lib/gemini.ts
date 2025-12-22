// Helper function to get available Gemini model
export async function getAvailableModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  const response = await fetch(listUrl);
  const data = await response.json();
  
  const models = data.models || [];
  const textModel = models.find((m: any) => 
    m.supportedGenerationMethods?.includes("generateContent") &&
    m.name.includes("gemini")
  );
  
  return textModel?.name || null;
}

// Helper function to generate content with Gemini
export async function generateContent(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = await getAvailableModel();
  
  if (!modelName) {
    throw new Error("No Gemini model available");
  }
  
  const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to generate content");
  }
  
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Helper function to generate embeddings
export async function generateEmbedding(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Try text-embedding-004 first (preferred model with quota)
  const preferredModels = [
    "models/text-embedding-004",
    "text-embedding-004",
  ];
  
  for (const modelName of preferredModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/${modelName}:embedContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.embedding?.values) {
        return data.embedding.values;
      }
    } catch (error) {
      continue;
    }
  }
  
  // Fallback: list models and find one that works
  const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  const listResponse = await fetch(listUrl);
  const listData = await listResponse.json();
  
  const models = listData.models || [];
  const embeddingModels = models.filter((m: any) => 
    m.supportedGenerationMethods?.includes("embedContent") &&
    !m.name.includes("embedding-001") // Skip embedding-001 as it has no quota
  );
  
  for (const model of embeddingModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/${model.name}:embedContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.embedding?.values) {
        return data.embedding.values;
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error("No embedding model available with quota");
}
