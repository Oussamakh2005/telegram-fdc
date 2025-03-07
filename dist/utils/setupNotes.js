const setupNotes = (notes, average) => {
    let message = "";
    for (const note of notes) {
        message += "- " + note + "\n";
    }
    message += "تقييمك : " + average + "/10";
    return message;
};
export default setupNotes;
