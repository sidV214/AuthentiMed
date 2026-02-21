import OpenAI from 'openai';

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function verifyMedicine(imageUrl) {
  const openai = getClient();

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Look at this medicine packaging image and respond with ONLY a number between 0 and 100 representing authenticity probability."
            },
            {
              type: "input_image",
              image_url: imageUrl
            }
          ]
        }
      ]
    });

    console.log("FULL AI RESPONSE:", JSON.stringify(response, null, 2));

    const text = response.output_text || "0";
    console.log("AI RAW CONTENT:", text);

    const score = parseInt(text.replace(/\D/g, '').slice(0, 3), 10);
    return Math.min(100, Math.max(0, isNaN(score) ? 0 : score));

  } catch (error) {
    console.error("AI ERROR FULL OBJECT:", error);
    return 0;
  }
}