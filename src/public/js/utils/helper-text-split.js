const textSplit = {
    do() {
        Handlebars.registerHelper("textSplit", function (string, firstPieceLenght, piece) {
            const firstPiece = string.slice(0, firstPieceLenght);
            const secondPiece = string.slice(firstPieceLenght);
            if (piece == 1) {
                return firstPiece;
            }
            return secondPiece;
        });
    }
};

export { textSplit };