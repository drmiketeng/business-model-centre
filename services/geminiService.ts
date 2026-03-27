import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { StatementData, Question, PrayerData, InteractiveScenario } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateQuestionsWithOptions(statementData: StatementData): Promise<Omit<Question, 'answer'>[]> {
  const prompt = `Based on the following business model statement, generate a list of exactly 20 insightful and tailored questions to conduct a deep analysis. For each question, also provide 3-4 diverse, relevant, and plausible multiple-choice style options that the user could select as part of their answer.

Business Model Statement:
- Industry: ${statementData.industry}
- Country: ${statementData.country}
- We help [${statementData.customer}] who [${statementData.problem}] by [${statementData.solution}] so they can [${statementData.benefit}]. We make money by [${statementData.revenueModel}]. Our biggest challenge is [${statementData.challenge}].

Return the result as a JSON array of objects, where each object has two keys: "text" (the question string) and "options" (an array of 3-4 option strings).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ['text', 'options']
            }
        }
    }
  });
  
  const text = response.text.trim();
  const jsonResponse = JSON.parse(text);
  return jsonResponse as Omit<Question, 'answer'>[];
}

export async function generateDemoAnswers(statementData: StatementData, questions: Omit<Question, 'answer'>[]): Promise<string[]> {
  const prompt = `
  You are the owner of a hypothetical bakery business. Your goal is to provide plausible, insightful answers to a questionnaire about your business.
  
  Your Business Model Statement:
  - Industry: ${statementData.industry}
  - Country: ${statementData.country}
  - We help [${statementData.customer}] who [${statementData.problem}] by [${statementData.solution}] so they can [${statementData.benefit}]. We make money by [${statementData.revenueModel}]. Our biggest challenge is [${statementData.challenge}].

  Here is the questionnaire. For each question, select one or more of the provided options and add a brief custom sentence to elaborate. Combine your selections and custom text into a single string for each answer. Format the answer as a multi-line string, with each selected point or custom detail prefixed by '- '.

  Questionnaire:
  ${JSON.stringify(questions, null, 2)}

  Return your answers as a JSON array of strings, where each string is a formatted answer to the corresponding question. The array must have exactly ${questions.length} elements.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  const text = response.text.trim();
  const jsonResponse = JSON.parse(text);
  return jsonResponse as string[];
}


export async function generateReport(
  statementData: StatementData,
  answeredQuestions: { text: string; answer?: string }[],
  isFaithBased: boolean,
  isDemo: boolean = false
): Promise<string> {
  const answersText = answeredQuestions.map(q => `Q: ${q.text}\nA: ${q.answer || 'Not answered'}`).join('\n\n');

  const faithBasedInstructions = isFaithBased
    ? `
- **Integrate Spiritual Perspectives:** Throughout the entire report, where appropriate, weave in relevant Biblical scriptures to support the secular recommendations and provide encouragement. The goal is to create a holistic report where faith-based wisdom and sound business strategy are aligned. For example, when discussing perseverance, you could cite Galatians 6:9. When discussing customer service, reference Philippians 2:3-4. This must feel integrated, not like a separate section.
`
    : '';

  const knowledgeBaseFocus = `
**Expert Knowledge Base & Analytical Framework:**
You will draw upon the strategic frameworks and concepts from the works of Dr. Michael Teng, primarily his books "Business Model Innovation: Introduction to Implementation" and "Small is the New Big". When you apply these concepts, you MUST cite them appropriately within the text (e.g., "As Dr. Teng explains in 'Business Model Innovation', a business model must be..." or "According to 'Small is the New Big', SMEs can leverage..."). Ensure you cite concepts from BOTH books throughout the report. This knowledge should be seamlessly integrated into your report to provide an expert, authoritative tone.

The key frameworks to apply are:

1.  **Four-Step Strategy for BMI Transformation (from "Business Model Innovation"):**
    *   **Strategy 1: Finding the Right Niche:** Use the Customer-Competition Orientation Matrix (Competition-Driven, Market-Driven, Internally-Driven, Customer-Driven) to assess the company's current and potential positioning. Dr. Teng emphasizes that leaders should strive to be Market-Driven.
    *   **Strategy 2: Designing the Business Model:** Use tools like the Business Model Canvas and Lean Canvas. The goal is a model that is Operationally sound, Marketable, and Viable.
    *   **Strategy 3: Navigating Corporate Transformation:** Use the "Three Phases" model (Phase I: Surgery - financial focus, autocratic; Phase II: Resuscitation - marketing focus, democratic; Phase III: Therapy - HR focus, spiritual) to identify where the company is in its lifecycle.
    *   **Strategy 4: Executing Productively & Innovatively:** Evaluate the potential for execution using the Corporate Transformation Index (CTI = Output/Input x Innovation Culture). A CTI > 2.7 indicates a high propensity to transform.

2.  **Core BMI Principles (from Dr. Teng's works):**
    *   **David vs. Goliath ("Small is the New Big"):** Frame the SME's challenge as an opportunity to "slay giants" through niche strategies and innovation, rather than direct competition on the giants' terms.
    *   **Three Rules of BMI Implementation:** 1. Think Big, Think Uniqueness, Think Action. 2. Act Productively, Innovatively, Swiftly. 3. Think Again, Act Again.
    *   **The 3 Ps (Prerequisites):** A successful business model is at the intersection of Passion (desire, love), Proficiency (capability, skills), and Profitability (financial gain, betterment of lives).
    *   **The 8 Ps (Critical Success Factors):** Analyze the business against Pain/Problem, Proposition/Product, Process/Procedures, People/Partners, Productivity/Producibility, Pliability/Plasticity, Platform/Promotability, and Pitfalls/Perils.

3.  **Technology and Disruption:**
    *   **Industry 4.0:** Consider the impact of the "ABCs of I4.0" (AI, Blockchain, Cloud, Data, Emerging Tech like IoT, Future Tech like Mixed Reality) on the user's business model.
    *   **Disruptive Innovation:** Analyze if the business is a disruptive entrant. As discussed in "Small is the New Big", disruptive innovations often come from smaller players serving overlooked market segments.

4.  **Financial Diagnosis:**
    *   While you won't have financial statements, apply principles from Dr. Teng's work on corporate turnaround. Discuss the importance of cash flow over profit in the short-term ("Cash is FACT and is like OXYGEN") and the need for financial viability.

When analyzing the seven toolkits, use this deeper knowledge to provide a richer, more expert analysis with direct attribution to Dr. Teng's books. For example, when discussing the Customer vs. Competition Matrix, state that "According to Dr. Teng's framework in 'Business Model Innovation', your company currently appears to be in the 'Customer-Driven' quadrant..." and explain the implications.
`;
  
  // NOTE: Internet research/Google Search grounding is intentionally disabled to speed up generation.
  const searchInstruction = `Do not perform external searches. Rely on your internal knowledge base to provide industry use cases and macroeconomic insights.`;
    
  const sourcesInstruction = `List the following sources:
  - "Business Model Innovation: Introduction to Implementation" by Dr. Michael Teng
  - "Small is the New Big" by Dr. Michael Teng
  - "Business Model Generation" (Business Model Canvas) by Alexander Osterwalder & Yves Pigneur
  - "Running Lean" (Lean Canvas) by Ash Maurya
  - "Value Proposition Design" (Unique Selling Proposition Canvas) by Alexander Osterwalder et al.
  - "Corporate Strategy" (Product vs Market Matrix) by Igor Ansoff
  
  Frameworks by Dr. Michael Teng:
  - Customer vs Competition
  - 8 Ps Critical Success Factors
  - Platform Business Model
  - Three Phases of Corporate Transformation`;


  const prompt = `
Context: You are an expert AI Business Model Advisor, deeply knowledgeable in strategic frameworks authored by Dr. Michael Teng. Your task is to generate a comprehensive, professional, and easily readable business analysis report for an SME.

User's Business Information:
---
**Business Model Statement:**
- Industry: ${statementData.industry}
- Country: ${statementData.country}
- We help [${statementData.customer}] who [${statementData.problem}] by [${statementData.solution}] so they can [${statementData.benefit}]. We make money by [${statementData.revenueModel}]. Our biggest challenge is [${statementData.challenge}].

**Detailed Q&A Responses:**
${answersText}
---

**Analysis Task & Report Structure:**
Analyze the user's business based on the provided information, integrating your deep knowledge base from Dr. Teng's work. Generate a detailed and comprehensive report. ${searchInstruction} Use horizontal rules ('---') to separate major sections. Use formatting to create a professional and highly readable document.

${knowledgeBaseFocus}
${faithBasedInstructions}

# Comprehensive Business Model Analysis

---

## 1. Executive Summary
A high-level overview of the key findings and most critical strategic recommendations, informed by Dr. Michael Teng's business model innovation frameworks.

---

## 2. Business Model Statement Analysis
Provide a concise analysis of the user's initial business model statement. Evaluate its clarity, coherence, and potential strengths and weaknesses based on the 3 Ps (Passion, Proficiency, Profitability) and the 8 Ps (Pain, Proposition, etc.) from Dr. Teng's frameworks.

---

## 3. Deep Dive: Business Model Assessment (Using Seven Toolkits)
For each of the seven toolkits, provide a very detailed analysis, applying the concepts from Dr. Teng's books. Follow this structure for EACH toolkit:
   - **Toolkit Name:**
   - **Analysis:** A deep breakdown of each component of the canvas/matrix based on the user's input, interpreted through the lens of Dr. Teng's BMI principles. Cite the books where appropriate. Ensure the analysis for the **Business Model Canvas** is particularly thorough.
   - **Outcome/Key Insight:** A concise summary of the main finding from this specific toolkit's analysis.
   - **Recommendation:** A specific, actionable recommendation derived directly from this insight.

   *Toolkits to Analyze:*
   1.  **Business Model Canvas (Measures: Operationality, Commerciality, Viability):** (Key partners, activities, resources, value propositions, customer relationships, channels, customer segments, cost structure, revenue streams.)
   2.  **Lean Canvas (Measures: Flexibility):** (Problem, solution, key metrics, unique value proposition, unfair advantage, channels, customer segments, cost structure, revenue streams.)
   3.  **Unique Selling Proposition Canvas (Measures: "Nichebility"):** (Value proposition, customer jobs, pains, and gains.)
   4.  **Platform Business Toolkit (Measures: Agility):** (If applicable, analyze platform aspects. If not, explain what lessons can be learned from platform models.)
   5.  **Product vs Market Matrix (Ansoff Matrix) (Measures: Marketability):** (Market penetration, product development, market development, diversification.)
   6.  **Customer vs Competition Matrix (Measures: Feasibility):** (Competitive landscape and customer positioning.)
   7.  **Three Phases of Corporate Transformation Toolkit (Measures: Capacity and Capability):** (Current stage and potential for transformation.)

---

## 4. In-Depth Market Analysis
   - **Industry Context & Use Cases:** Provide relevant use cases from ${statementData.industry} in ${statementData.country}. What are the latest trends?
   - **Macro-Economic Factors:** Analyze key macroeconomic trends affecting the business in ${statementData.country}.
   - **Key Risks and Opportunities:** A thorough breakdown of both internal and external risks and opportunities.

---

## 5. Summarised SWOT Analysis
Provide a detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) based on all the provided information. For each of the four sections, list 3-5 key points. After each point, add a "Comment and Recommendation" to explain its significance and suggest a strategic action based on Dr. Teng's frameworks.

---

## 6. Actionable Strategic Recommendations
Provide a prioritized list of clear, actionable recommendations based on the entire analysis. Group them into short-term (0-3 months), medium-term (3-12 months), and long-term (1+ year) goals.

---

## 7. Sources
${sourcesInstruction}

## 8. Other Helpful Resources

- Turnaround Centre
- Transformation Centre
- Business Model Centre
- Mergers & Acquisitions Centre
- Corporate Culture Centre
- Change Management Centre
- Accounting & Financial Centre
- Digital AI Centre
`;

  // No external tools (googleSearch) needed to ensure speed.
  const config: { tools?: any[] } = {};

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: config,
  });

  return response.text;
}

export async function generatePrayer(
  statementData: StatementData,
  answeredQuestions: { text: string; answer?: string }[],
  report: string
): Promise<PrayerData> {
    const answersText = answeredQuestions.map(q => `Q: ${q.text}\nA: ${q.answer || 'Not answered'}`).join('\n');

    // 1. Generate the prayer script
    const scriptPrompt = `
    You are a wise and empathetic spiritual guide. Based on the user's business information, their challenges, and the key recommendations from their business report, write a heartfelt and personal "Guidance Prayer" for them.

    **Prayer Structure and Content Requirements:**
    - **Length:** The prayer must be approximately 750 words long.
    - **Opening:** Begin the prayer by addressing "Heavenly Father".
    - **Content:** The prayer must be highly personal and not generic. It should specifically reference:
        - Their business type (e.g., "for this bakery...", "for this software company...")
        - Their stated customer: "${statementData.customer}"
        - Their core challenge: "${statementData.challenge}"
        - Key opportunities or recommendations mentioned in their report summary.
        - The prayer should ask for wisdom, guidance, strength, and clarity for the business owner. It should be encouraging, uplifting, and rooted in themes of stewardship, purpose, and faith in their entrepreneurial journey. It should reverently use terms like "Heavenly Father," "Lord," and "Jesus" to guide the tone.
    - **Closing:** The prayer **must** end with the exact phrase: "We pray all these in the name of Jesus Christ Amen". Do not add any text after this closing.

    **User's Business Info:**
    - Industry: ${statementData.industry}
    - We help [${statementData.customer}] who [${statementData.problem}] by [${statementData.solution}].
    - Biggest challenge is [${statementData.challenge}].
    
    **Key Q&A Insights:**
    ${answersText}

    **Key Report Recommendations (Summary):**
    ${report.substring(0, 2000)}...

    Produce only the text of the prayer.
    `;

    const scriptResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: scriptPrompt,
    });
    const prayerScript = scriptResponse.text;

    // 2. Generate the audio from the script
    const audioResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with a calm, reassuring, and warm voice: ${prayerScript}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm and steady voice
            },
        },
      },
    });

    const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data as string;
    
    return {
        script: prayerScript,
        audio: base64Audio,
    };
}

export async function generateTrainingScenarios(statementData: StatementData): Promise<InteractiveScenario[]> {
    const prompt = `
    Based on the following business model, generate 10 realistic and challenging training scenarios. These scenarios should be interactive exercises to test the user's strategic thinking.

    Business Model:
    - Industry: ${statementData.industry} in ${statementData.country}
    - Target Customer: ${statementData.customer}
    - Problem Solved: ${statementData.problem}
    - Solution: ${statementData.solution}
    - Biggest Challenge: ${statementData.challenge}

    For each of the 10 scenarios, you must provide:
    1.  A clear 'scenario' description.
    2.  An array of exactly 3 plausible 'options' for how the user could respond.
    3.  For each option, provide a brief 'analysis' explaining the potential pros, cons, and strategic implications of choosing that response.

    Return the result as a JSON array of objects, following this exact structure:
    [
      {
        "scenario": "A new, well-funded competitor opens two blocks away offering similar products at a 15% discount. How do you respond?",
        "options": [
          { "text": "Immediately match their prices to remain competitive.", "analysis": "Pros: Prevents immediate customer loss. Cons: Risks a price war, erodes profit margins, and devalues your brand if you compete on price alone." },
          { "text": "Launch a loyalty program and emphasize the unique quality and local sourcing of your ingredients.", "analysis": "Pros: Builds long-term customer relationships and reinforces your brand's value beyond price. Cons: May not be enough to sway price-sensitive customers in the short term." },
          { "text": "Ignore the competitor and continue business as usual, assuming your loyal customer base will remain.", "analysis": "Pros: Avoids a knee-jerk reaction and maintains your current strategy. Cons: High risk of losing market share if the competitor's offer is compelling enough to attract your customers." }
        ]
      },
      ...
    ]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        scenario: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    analysis: { type: Type.STRING },
                                },
                                required: ['text', 'analysis'],
                            }
                        }
                    },
                    required: ['scenario', 'options'],
                }
            }
        }
    });

    const text = response.text.trim();
    return JSON.parse(text) as InteractiveScenario[];
}

export async function evaluateUserResponse(scenario: string, userResponse: string, statementData: StatementData): Promise<string> {
    const prompt = `
    As an expert business strategist, evaluate a user's response to a training scenario.

    Business Context:
    - Industry: ${statementData.industry} in ${statementData.country}
    - Business Model: Helping ${statementData.customer} with ${statementData.problem} by ${statementData.solution}.
    - Key Challenge: ${statementData.challenge}

    Scenario:
    "${scenario}"

    User's Response:
    "${userResponse}"

    Your Task:
    Provide constructive feedback on the user's response. Be encouraging but also critical. Your feedback should:
    1.  Acknowledge the potential strengths of their approach.
    2.  Point out potential weaknesses, risks, or unintended consequences.
    3.  Suggest alternative perspectives or additional actions they might consider.
    4.  Keep the feedback concise and actionable (around 3-4 paragraphs).
    
    Do not repeat the scenario or the user's response in your feedback. Just provide the analysis.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
}

export async function getAssistantResponse(question: string): Promise<string> {
    const prompt = `You are a helpful virtual assistant for the "SME Business Model Advisor" web application.
    Your ONLY purpose is to answer questions about this specific application.
    
    Information about the application:
    - **Name:** SME Business Model Advisor
    - **Purpose:** To empower SMEs and entrepreneurs with expert advisory, practical tools, and tailored business model training. It uses AI to generate a comprehensive business report based on user inputs.
    - **Methodology:** The analysis is based on the strategic frameworks of Dr. Michael Teng, from his books "Business Model Innovation: Introduction to Implementation" and "Small is the New Big". The tool uses the 8 Ps for critical success factors.
    - **Core Features:**
        1.  **Statement Builder:** User inputs their business details.
        2.  **Q&A:** User answers 20 tailored questions.
        3.  **Report Generation:** The AI generates a detailed report analyzing the business using 7 key toolkits.
        4.  **Faith-Based Option:** Users can choose to receive a report that integrates spiritual principles and biblical scriptures.
        5.  **Interactive Training:** After the report, users can engage in training scenarios to test their strategic thinking.
    - **The 7 Toolkits:** Business Model Canvas, Lean Canvas, Value Proposition Canvas, Platform Business Toolkit, Product vs Market Matrix, Customer vs Competition Matrix, Three Phases of Corporate Transformation Toolkit.
    
    Your Rules:
    1.  **Stay On-Topic:** ONLY answer questions related to the SME Business Model Advisor application, its features, its purpose, the 7 toolkits it uses, or the methodology of Dr. Michael Teng.
    2.  **Decline Off-Topic Questions:** If the user asks about anything else (e.g., "what is the weather?", "write me a poem", "give me business advice for my specific unpublished idea"), you MUST politely decline. For example: "I can only answer questions about the SME Business Model Advisor tool and its features. How can I help you with that?"
    3.  **Be Concise:** Keep your answers brief and to the point.
    4.  **Do Not Hallucinate:** If you don't know the answer, say that you can only provide information about the application's documented features.
    
    User's Question:
    "${question}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
}