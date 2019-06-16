exports.ping = () => {

    const http = require('http');
    const express = require('express');
    const app = express();
    app.get("/", (request, response) => {
        console.log("📋 " + Date.now() + " ping received");
        response.sendStatus(200);
    });
    app.listen(3000);
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);

}