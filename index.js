require("dotenv").config()
const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require("cors")

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

console.log("Conectado ao Banco de Dados: Planet Scale")
const db = mysql.createConnection({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    ssl: {
        rejectUnauthorized: true
    }
});

app.get("/", (req, res) => {
    res.send("Jw Organization api")
})

app.post("/designation", (req, res) => {
    const week = req.body.week
    const positionInWeek = req.body.positionInWeek
    db.query
        (`SELECT ID, PLACE, TIME, DESIGNATED_1, DESIGNATED_2 FROM DESIGNATIONS2023 WHERE WEEK = ${week} AND P_IN_WEEK = ${positionInWeek}`,
            (err, result) => {
                if (err) res.send(err)
                res.send(result)
            })
})


app.post("/designate", (req, res) => {
    const id = req.body.id
    const place = req.body.place
    const initialTime = req.body.initialTime
    const finalTime = req.body.finalTime
    const designated1 = req.body.designated1
    const designated2 = req.body.designated2

    let time = `${initialTime.slice(0, 2)}${initialTime.slice(3)}${finalTime.slice(0, 2)}${finalTime.slice(3)}`
    parseInt(time)

    db.query
        (`UPDATE DESIGNATIONS2023 SET PLACE = "${place}", TIME = "${time}", DESIGNATED_1 = "${designated1}", DESIGNATED_2 = "${designated2}" WHERE ID = ${id}`)

})


app.post("/cart_places", (req, res) => {
    db.query
        ("SELECT * FROM cart_places ORDER BY PLACE",
            (err, result) => {
                if (err) res.send(err)
                res.send(result)
            })
})



app.post("/territories", (req, res) => {
    db.query
        ("SELECT * FROM territories ORDER BY NUMBER",
            (err, result) => {
                if (err) res.send(err)
                res.send(result)
            })
})


app.listen(PORT, () => {
    console.log("Running in the port:", PORT)
})