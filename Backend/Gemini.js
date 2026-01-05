import axios from "axios"

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL
    const apiKey = process.env.GEMINI_API_KEY
    const prompt = `You are Virtual Assistant named ${assistantName} created by ${userName}.

You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:
{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_date" | "get_time" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
  "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search krne ko bola hai toh userinput me only wo search wala text jaaye,
  "response": "<a short spoken response to read out loud to the user>"
}
  Instructions:
  - "type": determine the intent of the user.
  - "userInput": original sentence the user spoke.
  - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday",etc.

  Type meanings:: 


- "general": if it's a factual or informational question.
and if someone aska a question whose answer you know, categorize it as general and give a short answer.
- "google_search": if user wants to search something on Google .
- "youtube_search": if user wants to search something on YouTube.
- "youtube_play": if user wants to directly play a video or song.
- "calculator_open": if user wants to open a calculator.
- "instagram_open": if user wants to open instagram.
- "facebook_open": if user wants to onen facebook.
- "weather_open": if user wants to know weather.
- "get_time": if user asks for current time.
- "get_data": if user asks for today's date".
- "get_month": if user asks for the current month".

Important
- Use ${userName} agar koi puche tumhe kisne banaya
- Only respond with the JSON objects, nothing else.

now your user input- ${command}
`;
    const result = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        }
      }
    )

    return result.data.candidates[0].content.parts[0].text
  } catch (error) {
    if (error.response?.status === 429) {
      return JSON.stringify({
        type: "general",
        userInput: command,
        response: "My API limit is reached. Please try again in a few seconds."
      });
    }
    console.error("Gemini API Error:", error.response?.data || error.message)
    return null
  }
}
export default geminiResponse