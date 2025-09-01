import OpenAI from 'openai';
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

const proxyAgent = new HttpsProxyAgent("http://172.16.105.13:8118");

const fetchWithProxy = (input: any, init?: any) => {
    return fetch(input, { ...init, agent: process.env.NODE_ENV === "development" ? proxyAgent : undefined }) as any;
};

export type ModerationResult = {
    decision: "allow" | "flag";
    categories: string[];
    explanation: string;
};

// TODO: Make this configurable or use a more sophisticated prompt.
const moderationPrompt = `
You are an AI content moderator for a grievance-reporting application.

Rules for Allowed Content:
- Users may express grievances, complaints, or frustrations about services, organizations, or systems.
- Criticism of policies, procedures, or services is allowed.
- Strong emotions are acceptable if not abusive toward specific individuals.

Rules for Disallowed Content (should be flagged/rejected):
- Hate speech (attacks on race, ethnicity, religion, gender, sexual orientation, disability, etc.).
- Threats of violence, self-harm, or harm to others.
- Harassment or targeted abuse against individuals or specific people.
- Personal attacks, insults, or wishing harm on a person.
- Extremely obscene, graphic, or sexually explicit content.
- Spam, scams, or irrelevant promotional material.
- Personal information of others (doxxing).
- Content that violates privacy or confidentiality.
- Misinformation or false claims that could cause harm.

Output your decision in JSON:
{ "decision": "allow" | "flag", "categories": [...], "explanation": "..." }
`;

export const moderateContent = async (message: string) => {
    let result: ModerationResult = {
        decision: "allow",
        categories: [],
        explanation: "",
    };

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        fetch: fetchWithProxy,
    });
    await client.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "system", content: moderationPrompt }, { role: "user", content: message }],
    })
        .then((response) => {
            const content = response.choices[0]?.message?.content;
            if (content) {
                try {
                    result = JSON.parse(content);
                } catch {
                    result = {
                        decision: "flag",
                        categories: ["other"],
                        explanation: "AI moderation output could not be parsed",
                    };
                }
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
    return result;
};
