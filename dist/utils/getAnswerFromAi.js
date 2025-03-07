import model from "../services/gemini.js";
const getAnswer = async (prompt) => {
    try {
        console.log(prompt);
        const answer = await model.generateContent(prompt);
        const data = JSON.parse(answer.response.text().substring(7, answer.response.text().length - 3));
        console.log(data);
        return data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};
export default getAnswer;
