import { GoogleGenAI } from "@google/genai";
import type { VisualizationStep } from "../types";

let ai: GoogleGenAI | null;
let initialized = false;

// Initialize the client lazily to prevent top-level errors during module parsing.
function getAiClient(): GoogleGenAI | null {
  if (initialized) {
    return ai;
  }
  initialized = true;

  try {
    // This is the most sensitive part. We expect `process.env.API_KEY` to be
    // injected by the environment. If it's missing or the environment doesn't
    // define `process`, we handle it gracefully.
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("API_KEY environment variable not set. AI features will be disabled.");
      ai = null;
    }
  } catch (error) {
    console.warn("Could not initialize Gemini AI client, likely because 'process' is not defined in this environment.", error);
    ai = null;
  }
  return ai;
}


export async function getExplanation(treeStructure: string, step: VisualizationStep): Promise<string> {
    const geminiClient = getAiClient();
    if (!geminiClient) {
        return "Gemini API key is not configured. Cannot provide an AI explanation.";
    }

    const model = 'gemini-2.5-flash';

    const prompt = `
        You are an expert computer science professor explaining the Minimax algorithm with Alpha-Beta pruning.
        A student is visualizing the algorithm on a specific tree and is at a particular step.
        Your task is to provide a clear, concise, and helpful explanation for the current step.

        **Tree Structure (S-expression format):**
        \`\`\`
        ${treeStructure}
        \`\`\`

        **Current Algorithm State:**
        - **Step Type:** ${step.type}
        - **Node in Focus:** (Details will be in the message)
        - **Current Alpha (α):** ${step.alpha === -Infinity ? '-∞' : step.alpha}
        - **Current Beta (β):** ${step.beta === Infinity ? '+∞' : step.beta}
        - **Message Log:** "${step.message}"

        **Your Instructions:**
        1.  Start by directly explaining what is happening in the current step based on the "Message Log".
        2.  Explain the *reasoning* behind this action. For example, if it's a 'VISIT', explain why we're exploring this node. If it's an 'UPDATE', explain why alpha or beta is being updated. If it's a 'PRUNE', explain precisely why the pruning condition (β <= α) was met.
        3.  Briefly predict what the next logical step for the algorithm will be (e.g., "Next, the algorithm will move down to explore its first child...").
        4.  Keep the tone encouraging and educational. Use Markdown for formatting (like **bold** for key terms and \`code\` for values/nodes). Do not use headers.
    `;

    try {
        const response = await geminiClient.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Failed to get explanation from AI: ${error.message}`;
        }
        return "An unknown error occurred while communicating with the AI service.";
    }
}
