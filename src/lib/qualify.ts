// Lead Qualification Engine
// Primary: DeepSeek API. Fallback: Rule-based scoring if API unavailable.

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  insuranceClaim: boolean;
  timeline: "emergency" | "weeks" | "months" | "just_browsing";
  propertyAddress: string;
  budgetRange: string;
  message: string;
}

export interface QualifiedLead extends LeadData {
  score: number;
  priority: "hot" | "warm" | "cold";
  summary: string;
  recommendedAction: string;
  qualifyingFactors: string[];
  disqualifyingFactors: string[];
}

const SYSTEM_PROMPT = `You are a lead qualification expert for a roofing contractor in the US.

Analyze the lead and return ONLY valid JSON with these fields:
- score: 0-100 likelihood to convert
- priority: "hot" (70+), "warm" (40-69), "cold" (0-39)
- summary: one sentence about lead quality
- recommendedAction: call_immediately | follow_up_today | follow_up_this_week | nurture_long_term
- qualifyingFactors: string[] of positive signals
- disqualifyingFactors: string[] of warning signs

Scoring:
- Insurance claim + emergency = 85-100
- Clear need + specific address = 70-85
- Vague request = 20-40
- Just browsing = 0-20

Example output:
{"score":92,"priority":"hot","summary":"Insurance claim for emergency roof replacement — highest intent","recommendedAction":"call_immediately","qualifyingFactors":["insurance claim","emergency"],"disqualifyingFactors":[]}`;

export async function qualifyLead(lead: LeadData): Promise<QualifiedLead> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // If DEEPSEEK_API_KEY is set, use DeepSeek API
  if (apiKey) {
    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(lead) },
          ],
          temperature: 0.1,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content) as QualifiedLead;
        result.qualifyingFactors = result.qualifyingFactors || [];
        result.disqualifyingFactors = result.disqualifyingFactors || [];
        return result;
      }
    } catch (error) {
      console.error("DeepSeek API error, falling back to rule-based:", error);
    }
  }

  // Also try GROQ if key is set (free tier, fast, Llama 3)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(lead) },
          ],
          temperature: 0.1,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content) as QualifiedLead;
        result.qualifyingFactors = result.qualifyingFactors || [];
        result.disqualifyingFactors = result.disqualifyingFactors || [];
        return result;
      }
    } catch (error) {
      console.error("Groq API error, falling back to rule-based:", error);
    }
  }

  // Final fallback: rule-based scoring (no API needed)
  return fallbackQualification(lead);
}

function fallbackQualification(lead: LeadData): QualifiedLead {
  let score = 50;
  const qualifyingFactors: string[] = [];
  const disqualifyingFactors: string[] = [];

  if (lead.insuranceClaim) {
    score += 20;
    qualifyingFactors.push("Insurance claim — high intent");
  }
  if (lead.timeline === "emergency") {
    score += 25;
    qualifyingFactors.push("Emergency — immediate need");
  } else if (lead.timeline === "weeks") {
    score += 15;
    qualifyingFactors.push("Urgent timeline");
  } else if (lead.timeline === "just_browsing") {
    score -= 30;
    disqualifyingFactors.push("Just browsing — low intent");
  }
  if (lead.budgetRange && lead.budgetRange !== "not_sure") {
    score += 10;
    qualifyingFactors.push("Has budget awareness");
  }
  if (lead.propertyAddress.length > 10) {
    score += 5;
    qualifyingFactors.push("Provided property address");
  }
  if (lead.message.length > 50) {
    score += 5;
    qualifyingFactors.push("Detailed message");
  }
  if (!lead.email && !lead.phone) {
    score -= 20;
    disqualifyingFactors.push("No contact info");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    ...lead,
    score,
    priority: score >= 70 ? "hot" : score >= 40 ? "warm" : "cold",
    summary: `Lead scored ${score}/100`,
    recommendedAction:
      score >= 70 ? "call_immediately" :
      score >= 40 ? "follow_up_today" :
      score >= 20 ? "follow_up_this_week" :
      "nurture_long_term",
    qualifyingFactors,
    disqualifyingFactors,
  };
}
