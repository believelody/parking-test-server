import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import user from "./api/user";
import spot from "./api/spot";

const app = express();
const PORT = process.env.PORT || 5000;

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use("/users", user);
app.use("/spots", spot);

app.listen(PORT, () => `Server running at port: ${PORT}`);
