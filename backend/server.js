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

app.get("/transactions", (req, res) => {
  const data = readData();
  res.json(data);
});

app.post("/transactions", (req, res) => {
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

app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const updatedData = data.filter((transaction) => transaction.id !== id);
  writeData(updatedData);
  res.status(200).json({ message: "Transaction deleted successfully" });
});

// maybe later add put to be able to modify transactions detailes if made a mistake

app.get("/analytics/summary", (req, res) => {
  const data = readData();
  const income = data
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const expenses = data
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  res.json({ income, expenses });
});

app.get("/analytics/categories", (req, res) => {
  const data = readData();
  const categoriesSummary = data
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {});

  res.json(categoriesSummary);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
