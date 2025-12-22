import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length);

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // First, list available models to see what we can use
    console.log("Listing available models...");
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    try {
      const listResponse = await fetch(listUrl);
      const listData = await listResponse.json();
      
      if (!listResponse.ok) {
        console.log("Failed to list models:", listData);
        return NextResponse.json({
          error: "Failed to list models",
          details: listData,
          suggestion: "Your API key may be invalid or from the wrong service. Please get a new key from https://aistudio.google.com/app/apikey"
        }, { status: 500 });
      }

      console.log("Available models:", JSON.stringify(listData, null, 2));

      // Find a model that supports generateContent
      const availableModels = listData.models || [];
      const textGenerationModels = availableModels.filter((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent")
      );

      if (textGenerationModels.length === 0) {
        return NextResponse.json({
          error: "No text generation models available",
          availableModels: availableModels.map((m: any) => m.name),
          suggestion: "Your API key doesn't have access to any Gemini models"
        }, { status: 500 });
      }

      // Try the first available model
      const modelToUse = textGenerationModels[0].name;
      console.log(`Using model: ${modelToUse}`);

      const url = `https://generativelanguage.googleapis.com/v1/${modelToUse}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`SUCCESS with model: ${modelToUse}`);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        return NextResponse.json({
          response: text,
          modelUsed: modelToUse,
          allAvailableModels: textGenerationModels.map((m: any) => m.name)
        });
      } else {
        console.log(`Failed with ${modelToUse}:`, data);
        return NextResponse.json({
          error: data.error?.message || "Failed to generate content",
          details: data
        }, { status: 500 });
      }

    } catch (error: any) {
      console.error("Error:", error);
      return NextResponse.json({
        error: error.message || "Failed to process request"
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
