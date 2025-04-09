import express from 'express';

console.log("App started");

const app = express();

app.get("/", (req, res) => {
    res.send({});
});

const PORT = 8080;
app.listen(PORT, () => console.log('Server is running on port:', PORT));