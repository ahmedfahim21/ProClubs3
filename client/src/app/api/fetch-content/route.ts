import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface ClubData {
  name: string
  location: string
  stadium: string
  formation: string
  style: string
  matches_played: number
  matches_won: number
  matches_drawn: number
  matches_lost: number
  goals_scored: number
  goals_conceded: number
}

export async function POST(req: NextRequest) {
  try {
    const { clubData } = await req.json() as { clubData: ClubData };
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Generate realistic social media and news content for the football club "${clubData.name}" based on their current stats and information:

    Club Information:
    - Name: ${clubData.name}
    - Location: ${clubData.location}
    - Stadium: ${clubData.stadium}
    - Formation: ${clubData.formation}
    - Playing Style: ${clubData.style}
    - Matches Played: ${clubData.matches_played}
    - Matches Won: ${clubData.matches_won}
    - Matches Drawn: ${clubData.matches_drawn}
    - Matches Lost: ${clubData.matches_lost}
    - Goals Scored: ${clubData.goals_scored}
    - Goals Conceded: ${clubData.goals_conceded}

    Generate content that reflects the club's current performance and situation. Include:
    1. A Twitter post from the club's official account
    2. An Instagram post about new merchandise or events
    3. A tweet from a player
    4. A news article about stadium or club development
    5. A fan comment on Facebook
    6. A pundit/expert analysis
    7. A news article about the manager or team

    Format the response as a JSON object with the following structure:
    {
      "twitter": { "author": string, "content": string, "date": string, "likes": number, "comments": number },
      "instagram": { "author": string, "content": string, "date": string, "likes": number, "comments": number },
      "playerTweet": { "author": string, "content": string, "date": string, "likes": number, "comments": number },
      "news1": { "title": string, "excerpt": string, "date": string },
      "facebook": { "author": string, "content": string, "date": string, "likes": number, "comments": number },
      "expert": { "author": string, "content": string, "date": string, "source": string },
      "news2": { "title": string, "excerpt": string, "date": string }
    }

    IMPORTANT: 
    1. Return ONLY the JSON object without any markdown formatting or additional text
    2. Make the content relevant to the club's current performance and stats
    3. Include the club's name, stadium, and location in relevant posts
    4. Make the expert analysis reflect the club's playing style and formation`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: [{ text: prompt }],
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('No content generated');
    }

    let text = result.candidates[0].content.parts[0].text;
    
    // Clean the response text by removing markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const content = JSON.parse(text);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
} 