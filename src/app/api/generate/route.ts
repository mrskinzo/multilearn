import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert educator and learning specialist. When given educational text, you generate comprehensive multi-sensory learning materials. You always respond with valid JSON only — no markdown, no explanation, just the raw JSON object.`;

const buildUserPrompt = (text: string) => `
Analyze this educational content and generate multi-sensory learning materials.

<content>
${text}
</content>

Return a single valid JSON object with exactly this structure:

{
  "summary": "A well-written 3-paragraph audio-friendly summary of the core concepts. Use clear, conversational language suitable for listening.",

  "mindMap": {
    "topic": "The main topic in 2-5 words",
    "branches": [
      {
        "label": "Main concept 1",
        "children": [
          { "label": "Sub-point A" },
          { "label": "Sub-point B" }
        ]
      }
    ]
  },

  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ],

  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Why this answer is correct and others are wrong."
    }
  ],

  "explanations": {
    "simple": "Explain all the key concepts as if talking to a curious 10-year-old. Use simple words, everyday examples, and short sentences.",
    "analogy": "Explain all the key concepts through one extended, creative analogy that makes abstract ideas concrete and memorable.",
    "technical": "Explain all the key concepts with full technical depth, precise terminology, and nuanced detail for an advanced learner or professional."
  }
}

Requirements:
- mindMap: 4-6 main branches, each with 2-4 children
- flashcards: exactly 8-10 cards covering key terms and concepts
- quiz: exactly 5 multiple choice questions, answerIndex is 0-3
- explanations: each at least 150 words, genuinely different approaches
- summary: 3 paragraphs, suitable for text-to-speech

Return only the JSON object, nothing else.
`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide at least 20 characters of text." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(text.trim()),
        },
      ],
    });

    const raw = message.content[0];
    if (raw.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Strip any accidental markdown code fences
    const cleaned = raw.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
