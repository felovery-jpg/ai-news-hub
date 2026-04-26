// Gemini API免费版 - 用于AI生成摘要、标签、SEO描述

export async function generateAISummary(
  title: string,
  rawContent: string
): Promise<{ summary: string; tags: string[]; seoDescription: string }> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    // Fallback: use raw content snippet
    return {
      summary: rawContent.substring(0, 300) + '...',
      tags: [],
      seoDescription: rawContent.substring(0, 160),
    }
  }
  
  try {
    const prompt = `You are an AI news editor. Analyze this article and respond with JSON only.

Title: ${title}
Content: ${rawContent.substring(0, 1000)}

Respond with this exact JSON structure:
{
  "summary": "2-3 sentence engaging summary for readers (max 400 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seoDescription": "SEO meta description under 160 chars"
}

Focus on AI, machine learning, and technology topics. Make it compelling.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    )
    
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        summary: parsed.summary || rawContent.substring(0, 300),
        tags: parsed.tags || [],
        seoDescription: parsed.seoDescription || rawContent.substring(0, 160),
      }
    }
  } catch (error) {
    console.error('Gemini API error:', error)
  }
  
  return {
    summary: rawContent.substring(0, 300) + '...',
    tags: [],
    seoDescription: rawContent.substring(0, 160),
  }
}
