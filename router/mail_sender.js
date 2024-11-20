module.exports = function (app) {
    app.get('/gmail_sender/create/', (req, res) => {
        let x = require("./../src/mail_sender/gmail");
        console.log("X", x)
        x.main(req, res);
    })
}