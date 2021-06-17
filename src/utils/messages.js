const generateMessage = (username,text) => {
    const message = {
        username,
        text,
        createdAt: new Date().getTime()
    }

    return message;
}

const generateLocationMessage = (username,location) => {
    const message = {
        username,
        url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime()
    };

    return message;
}

module.exports = {
    generateMessage,
    generateLocationMessage
}