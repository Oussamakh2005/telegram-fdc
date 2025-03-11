import model from "../services/gemini.js";
const getAnswer = async (prompt) => {
    try {
        const answer = await model.generateContent(prompt);
        const data = JSON.parse(answer.response.text().substring(7, answer.response.text().length - 3));
        return data;
    }
    catch (err) {
        return null;
    }
};
export default getAnswer;
