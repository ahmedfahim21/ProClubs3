import { Player } from "@/app/init/team/page";
import { NATIONALITIES, POSITIONS } from "./constants";

export const generatePlayer = (nationality: keyof typeof NATIONALITIES) => {

    const countryData = NATIONALITIES[nationality] || NATIONALITIES["England"];
    const firstName = countryData.firstNames[Math.floor(Math.random() * countryData.firstNames.length)];
    const lastName = countryData.names[Math.floor(Math.random() * countryData.names.length)];
    const positionRoll = Math.random();
    let position: string = "MID";
    let cumulativeProbability = 0;

    for (const [pos, probability] of Object.entries(POSITIONS)) {
        cumulativeProbability += probability;
        if (positionRoll <= cumulativeProbability) {
            position = pos;
            break;
        }
    }

    const attributes = {
        physical: 50,
        speed: 50,
        shooting: 50,
        passing: 50,
        dribbling: 50,
        defending: 50
    };

    switch (position) {
        case "GK":
            attributes.physical = Math.round(Math.random() * 30 + 70);
            attributes.speed = Math.round(Math.random() * 50 + 50);
            attributes.shooting = Math.round(Math.random() * 70 + 30);
            attributes.passing = Math.round(Math.random() * 50 + 50);
            attributes.dribbling = Math.round(Math.random() * 70 + 30);
            attributes.defending = Math.round(Math.random() * 40 + 60);
            break;

        case "DEF":
            attributes.physical = Math.round(Math.random() * 25 + 75);
            attributes.speed = Math.round(Math.random() * 40 + 60);
            attributes.shooting = Math.round(Math.random() * 70 + 30);
            attributes.passing = Math.round(Math.random() * 50 + 50);
            attributes.dribbling = Math.round(Math.random() * 70 + 30);
            attributes.defending = Math.round(Math.random() * 30 + 70);
            break;

        case "MID":
            attributes.physical = Math.round(Math.random() * 50 + 50);
            attributes.passing = Math.round(Math.random() * 25 + 75);
            attributes.speed = Math.round(Math.random() * 40 + 60);
            attributes.shooting = Math.round(Math.random() * 50 + 50);
            attributes.dribbling = Math.round(Math.random() * 40 + 60);
            attributes.defending = Math.round(Math.random() * 50 + 50);
            break;

        case "FWD":
            attributes.physical = Math.round(Math.random() * 60 + 40);
            attributes.speed = Math.round(Math.random() * 30 + 70);
            attributes.shooting = Math.round(Math.random() * 30 + 70);
            attributes.passing = Math.round(Math.random() * 50 + 50);
            attributes.dribbling = Math.round(Math.random() * 40 + 60);
            attributes.defending = Math.round(Math.random() * 70 + 30);
            break;
    }


    const age = Math.floor(Math.random() * 21) + 17;

    return {
        name: `${firstName} ${lastName}`,
        nationality,
        position,
        age,
        attributes,
        imageUrl: null // Will be populated later
    };
};

export const generateImagePrompt = (player: Player) => {
    const { nationality, position, age } = player;

    const positionElements: Record<string, string> = {
        "GK": "goalkeeper gloves, goalkeeper jersey",
        "DEF": "defender stance, focused expression",
        "MID": "midfielder pose, alert expression",
        "FWD": "forward stance, confident expression"
    };
    const positionElement = positionElements[position as keyof typeof positionElements] || "";

    let ageDescription = "";
    if (age < 22) {
        ageDescription = "young, fresh face";
    } else if (age > 30) {
        ageDescription = "experienced, mature features";
    } else {
        ageDescription = "in prime condition";
    }
    const enhancedPrompt = `
        Generate a professional football player headshot with the following specifications:
        - Portrait of a ${nationality} football player, ${ageDescription}, ${position} position, ${positionElement}.
        - Consistent portrait style: head and shoulders view
        - 2D cartoonish digital art style
        - Solid white background
        - Uniform lighting across all images
        - Professional team jersey (generic, no specific team logo)
        - No text or watermarks
        - Aspect ratio: square
        `;
    return enhancedPrompt;
};