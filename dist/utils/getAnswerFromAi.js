import model from "../services/gemini.js";
const getAnswer = async (prompt) => {
    try {
        const answer = await model.generateContent(prompt);
        const data = JSON.parse(answer.response.text().replace(/```|JSON/gi, "").trim());
        return data;
    }
    catch (err) {
        return null;
    }
};
export default getAnswer;
