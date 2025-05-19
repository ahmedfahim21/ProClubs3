import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Initialize the Google Gemini AI client
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Prepare the content parts
        const contents = [{ text: prompt }]; 

        // Make the API request to Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation", 
            contents: contents,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        // Process the response
        let imageData = null;
        let responseText = null;

        if (response && response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    responseText = part.text;
                } else if (part.inlineData) {
                    imageData = part.inlineData.data;
                }
            }
        }

        if (!imageData) {
            return NextResponse.json({ error: 'No image generated' }, { status: 500 });
        }

        // Return the image data and any text
        return NextResponse.json({
            imageUrl: `data:image/png;base64,${imageData}`,
            text: responseText
        });
    } catch (error: any) {
        console.error('Error generating image:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate image' }, { status: 500 });
    }
}