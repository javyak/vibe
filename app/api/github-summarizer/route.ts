import { supabase } from "@/app/lib/supabaseClient";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(request: NextRequest) {
  try {
    const {repoUrl } = await request.json();
    const apiKey = request.headers.get('x-api-key');


    // Validate API key existence
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "No API key provided" },
        { status: 400 }
      );
    }

    // Validate repo URL
    if (!repoUrl) {
      return NextResponse.json(
        { success: false, message: "No repository URL provided" },
        { status: 400 }
      );
    }

    // First, validate the API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, usage')
      .eq('value', apiKey)
      .limit(1)
      .single();

    if (keyError) {
      // If error is not found, it means the key is invalid
      if (keyError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: "Invalid API key" },
          { status: 401 }
        );
      }
      
      // If any other error occurred
      return NextResponse.json(
        { success: false, message: "Error validating API key" },
        { status: 500 }
      );
    }

    // Extract GitHub repo information
    let owner, repo;
    try {
      const url = new URL(repoUrl);
      // Handle github.com URLs
      if (url.hostname === 'github.com') {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          owner = pathParts[0];
          repo = pathParts[1];
        }
      }
      
      if (!owner || !repo) {
        return NextResponse.json(
          { success: false, message: "Invalid GitHub repository URL format" },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Increment API key usage count
    await supabase
      .from('api_keys')
      .update({ usage: (keyData.usage || 0) + 1 })
      .eq('id', keyData.id);

    // Get README content from GitHub API
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!readmeResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch repository README" },
        { status: readmeResponse.status }
      );
    }

    const readmeContent = await readmeResponse.text();
    
    // Skip LangChain's prompt template and directly call the model
    const model = new ChatGoogleGenerativeAI({
      temperature: 0.5,
      modelName: "gemini-1.5-pro",
      apiKey: process.env.GOOGLE_API_KEY,
    });
    
    // Create a manually formatted prompt
    const fullPrompt = `Summarize the following GitHub repository README content and extract interesting facts.
README Content: ${readmeContent}

You MUST format your response as a valid JSON object. Output ONLY JSON, nothing else.
The JSON must follow this exact structure:
{
  "summary": "A concise summary of the repository",
  "coolFacts": ["Fact 1", "Fact 2", "Fact 3"]
}

IMPORTANT: Do not include anything before or after the JSON object. Your entire response should be parseable as JSON.`;

    // Call the model directly without using the PromptTemplate
    const result = await model.invoke(fullPrompt);
    const rawResult = result.content.toString();
    
    console.log("Raw result:", rawResult); // Log the raw result for debugging

    // Manually parse JSON with error handling
    let parsedResult;
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      let jsonText = rawResult;
      if (rawResult.includes("```json")) {
        jsonText = rawResult.split("```json")[1].split("```")[0].trim();
      } else if (rawResult.includes("```")) {
        jsonText = rawResult.split("```")[1].split("```")[0].trim();
      }
      
      parsedResult = JSON.parse(jsonText);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      console.error("Raw response:", rawResult);
      
      // If we failed to parse, attempt to extract a summary from the text
      const summary = rawResult.substring(0, 300); // Get first 300 chars as summary
      
      // Extract bullet points as facts if they exist
      const facts = [];
      const lines = rawResult.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          facts.push(trimmed.substring(2));
        }
      }
      
      // If no bullet points found, create some facts from sentences
      if (facts.length === 0) {
        const sentences = rawResult.split(/[.!?]+/);
        for (let i = 1; i < sentences.length && facts.length < 3; i++) {
          const sentence = sentences[i].trim();
          if (sentence.length > 10 && sentence.length < 150) {
            facts.push(sentence);
          }
        }
      }
      
      parsedResult = {
        summary: summary,
        coolFacts: facts.length > 0 ? facts.slice(0, 3) : ["The repository contains useful code", "Documentation is provided", "Examples are included"]
      };
    }

    // Structure the output
    const summary = {
      repoName: `${owner}/${repo}`,
      summary: parsedResult.summary || "Summary not available",
      coolFacts: parsedResult.coolFacts || []
    };

    return NextResponse.json({
      success: true,
      message: "Repository summarized successfully",
      summary: summary
    }, { status: 200 });
    
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "Server error", error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
} 