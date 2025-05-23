import { PLAYING_STYLES } from "@/utils/constants";
import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { homeTeam, awayTeam } = await request.json();

    // Validate input early
    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: "Invalid input: homeTeam and awayTeam are required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are a football match simulator. I will provide you with two teams' data including tactics, formation, and players. 
You need to simulate a realistic 90-minute football match and provide streaming match events.

HOME TEAM: ${homeTeam.name}
Formation: ${homeTeam.formation}
Playing Style: ${PLAYING_STYLES[homeTeam.style as keyof typeof PLAYING_STYLES]}

AWAY TEAM: ${awayTeam.name}
Formation: ${awayTeam.formation}
Playing Style: ${PLAYING_STYLES[awayTeam.style as keyof typeof PLAYING_STYLES]}

INSTRUCTIONS:
1. Simulate a realistic match considering formations, and tactics
2. Generate events chronologically from minute 0 to 90+
3. Include various event types: goals, shots, fouls, cards, substitutions, etc.
4. Each event should have: minute, type, player, team, description, score
5. Do not take any names, just use player positions (e.g., "striker", "midfielder")
6. Provide realistic scoreline based on team strength and tactics
7. Format each event as JSON on a new line
8. Create a max of 10 events in total
9. Last event should be "match_end" with final score

Event format:
{"minute": 15, "type": "shot", "team": "home", "description": "Long range effort saved by goalkeeper", "score": {"home": 0, "away": 0}}
{"minute": 23, "type": "goal", "team": "away", "description": "Brilliant header from corner kick", "score": {"home": 0, "away": 1}}

Start the simulation now:
`;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: [{ text: prompt }],
            config: {
              responseModalities: [Modality.TEXT],
            },
          });

          const fullText = result?.text?.trim();

          if (!fullText) {
            controller.enqueue(encoder.encode("data: {\"error\": \"Empty response from AI Agent\"}\n\n"));
            controller.close();
            return;
          }

          // Strip out markdown artifacts if present
          const cleanText = fullText.replace(/^\s*json```/, '').replace(/```$/, '').trim();
          const lines = cleanText.split(/\r?\n/);

          console.log("Parsed lines:", cleanText);

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const parsed = JSON.parse(trimmed);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
            } catch (err) {
              console.warn("Malformed JSON line:", trimmed, err);
            }
          }
          controller.close();
        } catch (err) {
          console.error("AI response error:", err);
          controller.enqueue(encoder.encode(`data: {\"error\": \"AI model call failed\"}\n\n`));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("POST handler error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
