const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// https://www.npmjs.com/package/node-fetch#commonjs
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// enable pre-flight
app.options("*", cors());

app.post("/", (req, res) => {
  console.log(
    `INFO: Received authenticate request with body: ${JSON.stringify(req.body)}`
  );

  fetch(`${process.env.RECALL_API_HOST}/api/v1/calendar/authenticate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.RECALL_API_KEY,
    },
    body: JSON.stringify({ user_id: req.body.userId }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(
        `INFO: Received authenicate response from server ${JSON.stringify(
          data
        )}`
      );
      return res.json(data);
    })
    .catch((error) => {
      console.log(
        `ERROR: Failed to authenticate calendar v1 request due to ${error}`
      );
      return res.status(500).json({ error: "Failed to authenticate" });
    });
});

app.listen(process.env.PORT, () => {
  console.log(
    `INFO: Calendar v1 demo server is running on port ${process.env.PORT}`
  );
});
