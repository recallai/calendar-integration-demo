import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import consoleStamp from "console-stamp";
import express from "express";
import "express-async-errors";
import errorHandler from "errorhandler";
import cookieParser from "cookie-parser";

import { prepareDb } from "./db.js";
import router from "./routes/index.js";
import authenticate from "./middlewares/authenticate.js";
import notice from "./middlewares/notice.js";
import allowPutDeleteViaForms from "./middlewares/allow-put-delete-via-forms.js";
import Recall from "./services/recall/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
consoleStamp(console);

// setup db & recall service
await prepareDb();
Recall.initialize();

// setup express app
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(allowPutDeleteViaForms);
app.use(cookieParser());
app.use(authenticate);
app.use(notice);
app.use(router);
if (process.env.NODE_ENV === "development") {
  // only use in development
  console.log("Using errorhandler in development mode");
  app.use(errorHandler());
}

app.listen(process.env.PORT, () => {
  console.log(`Started demo app on ${process.env.PORT}`);
});
