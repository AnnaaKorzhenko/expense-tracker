const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, "data.json");

function readData() {
  const data = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
