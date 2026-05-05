const cors = require("cors")
const express =require("express")
const cookieParser=require("cookie-parser")

const app =express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())


/* require all the routes here */
const authRouter =require("./routes/auth.route")
const interviewRouter = require("./routes/interview.routes")

/*using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/*using all the routes here */
app.use("/api/auth", authRouter)



module.exports = app