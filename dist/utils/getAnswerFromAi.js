import model from "../services/gemini.js";
const getAnswer = async (prompt) => {
    try {
        const answer = await model.generateContent(prompt);
        const rawText = answer.response.text();
        const jsonMatch = rawText.match(/\{.*\}/s);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return data;
        }
        else {
            return null;
        }
    }
    catch (err) {
        return null;
    }
};
export default getAnswer;
