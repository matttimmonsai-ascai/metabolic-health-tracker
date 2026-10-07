import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age, weight, ability, equipment, finances, homa_ir } = body;

    const prompt = `You are a world-class metabolic health and fitness coach. 
Create a highly customized resistance workout routine for a client with the following profile:
- Age: ${age}
- Current Weight: ${weight} lbs
- Fitness Ability: ${ability}
- Available Equipment: ${equipment}
- Financial Budget for Fitness: ${finances}
- Latest HOMA-IR Score: ${homa_ir || 'Unknown'} (Focus on insulin sensitization)

Provide a clear, 1-week resistance training schedule. 
Explain briefly *why* this specific routine helps lower HOMA-IR and improve metabolic health.
Format the response in clean Markdown with headers, bold text, and bullet points. Do not include any HTML.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured in Vercel." }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    const workoutText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ workout: workoutText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
