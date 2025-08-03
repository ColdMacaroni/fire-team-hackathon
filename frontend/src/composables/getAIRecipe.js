import { GoogleGenAI } from "@google/genai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });
const basePrompt = 
`Role: You are an expert data extraction model. Your sole function is to analyze cooking video transcripts and convert them into a structured JSON recipe format. You must adhere strictly to the provided schema and constraints. Your output must only be the JSON object, with no introductory text or commentary.
Task: I will provide a transcript from a cooking video. Analyze it and extract the recipe details to populate the JSON object according to the schema below.
JSON Output Schema & Constraints
You must generate a single, valid JSON object with the following structure:
1name (String): The name of the dish as mentioned in the video.
2tags (Array of Strings):
◦Provide a maximum of 3 of the most relevant tags.
◦Focus on cuisine (e.g., "Italian", "Mexican"), dietary profile (e.g., "Vegan", "Gluten-Free"), or complexity/type (e.g., "Easy", "Quick Meal").
3description (String):
◦A brief, engaging summary of the dish, written in clear and concise language.
◦This description must be under 100 words.
4ingredients (Array of Objects):
◦Each object must have three keys: "ingredient", "amount", and "unit".
◦If an amount or unit is not explicitly mentioned, use descriptive terms from the transcript (e.g., "1", "splash", "pinch") or "N/A" if no quantity is implied.
5instructions (String):
◦A single string containing all steps. make the steps detailed and clear.
◦Each step must start with a number followed by a period (e.g., 1.).
◦Each step must be separated by a newline character (\n).
Example (Few-Shot Learning)
Here is an example of how to process a transcript correctly.
Example Input Transcript:
"Hey everyone! Today we're making a super simple creamy tomato pasta. It's perfect for a weeknight when you want something comforting but fast. First, boil about 200 grams of pasta. While that's going, add a splash of olive oil to a pan with one diced onion. Sauté until soft, then add two cloves of minced garlic. Pour in a 400ml can of crushed tomatoes and let it simmer. Finally, stir in 100ml of heavy cream and season with salt and pepper. Drain your pasta, mix it all together, and top with parmesan. So good!"
Expected JSON Output:
JSON
{
  "name": "Creamy Tomato Pasta",
  "tags": ["Italian", "Easy", "Vegetarian"],
  "description": "A quick and easy vegetarian pasta dish featuring a rich, creamy tomato sauce. Sautéed onion and garlic form the base, which is simmered with crushed tomatoes and finished with heavy cream for a comforting and satisfying meal perfect for any weeknight.",
  "ingredients": [
    { "ingredient": "Pasta", "amount": "200", "unit": "g" },
    { "ingredient": "Olive Oil", "amount": "1", "unit": "splash" },
    { "ingredient": "Onion", "amount": "1", "unit": "N/A" },
    { "ingredient": "Garlic", "amount": "2", "unit": "cloves" },
    { "ingredient": "Crushed Tomatoes", "amount": "400", "unit": "ml" },
    { "ingredient": "Heavy Cream", "amount": "100", "unit": "ml" },
    { "ingredient": "Salt", "amount": "N/A", "unit": "N/A" },
    { "ingredient": "Pepper", "amount": "N/A", "unit": "N/A" },
    { "ingredient": "Parmesan", "amount": "N/A", "unit": "N/A" }
  ],
  "instructions": "1. Boil pasta.\n2. Add olive oil and diced onion to a pan and sauté until soft.\n3. Add minced garlic.\n4. Pour in crushed tomatoes and let simmer.\n5. Stir in heavy cream and season with salt and pepper.\n6. Drain the pasta and mix with the sauce.\n7. Top with parmesan."
}
Your Turn: Process This Transcript
Now, apply these rules to the following transcript. Generate only the JSON object.`

export async function getAIRecipe(transcript) {
  console.log('Fetching AI recipe...');
  const prompt = basePrompt + transcript;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log('AI Recipe fetched successfully:', response.text);
    return response.text;
  } catch (error) {
    console.error('Error fetching AI recipe:', error);
    throw error;
  }
}