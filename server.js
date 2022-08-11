const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const shortner = require("./shortner");
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

app.get('/:shortcode',(req,res) => {
    shortner.expand(req.params.shortcode)
    .then((url) => {
       res.redirect(url);
    })
    .catch((error) => {
    });
});

app.post('/', (req, res) => {
    let url = req.body.url;
    let code = req.body.code;
    let shortcode = false
    if (code !== "") {
        shortcode = shortner.shortencode(url, code);
    } else {
        shortcode = shortner.shorten(url);
    }
    res.send({url: "https://" + req.hostname + "/" + shortcode});
});

app.get('/shortlink/short', (req, res) => {
    const url = req.query.url;
    if (url === undefined) return res.status(404).send({
        status: 404,
        message: `Input Parameter url`
    });
    let shortcode = shortner.shorten(url);
    res.send({url: "https://" + req.hostname + "/" + shortcode});
});

app.use(function (req, res, next) {
    res.status(404).json({
        status: false,
        message: "Page not found :/"
    })
})

app.listen(PORT, () => {
    console.log(`Already deployed at: ${PORT}`);
});
