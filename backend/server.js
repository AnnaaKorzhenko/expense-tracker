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

app.get("/transaction", (req, res) => {
  const data = readData();
  res.json(data);
});

app.post("/transaction", (req, res) => {
  const { type, title, amount, category, date } = req.body;

  if (!type || !title || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newTransaction = {
    id: Date.now().toString(),
    type,
    title,
    amount: Number(amount),
    category,
    date,
  };

  const data = readData();
  data.push(newTransaction);
  writeData(data);
  res.status(201).json(newTransaction);
});

app.delete("/transaction/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const updatedData = data.filter((transaction) => transaction.id !== id);
  writeData(updatedData);
  res.status(200).json({ message: "Transaction deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
