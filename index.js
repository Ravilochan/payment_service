const express = require("express");
const mongoose = require("mongoose");
// const async = require("async");

const MONGOURI =
  "mongodb+srv://mern:cq3iwBBedA4paAAe@cluster0-npseq.gcp.mongodb.net/pay?retryWrites=true&w=majority";
const PORT = process.env.PORT || 7001;
const cors = require("cors");
const app = express();

const Payment = require("./models/payment");
const payment = require("./models/payment");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGOURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", () => {
  console.log("Error Connecting to the MongoDb");
});

app.post("/api/payment", (req, res) => {
  let transactionData = {};

  transactionData.user = req.body.user;
  transactionData.data = req.body.paymentData;
  transactionData.product = req.body.cartDetails;

  const payment = new Payment(transactionData);
  payment.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      payment: doc,
    });
  });
});

app.get("/api/allPayments", (req, res) => {
  Payment.find({}).then((allPayments) => res.json({ allPayments }));
});

app.listen(PORT, () =>
  console.log(`Server Started at : http://localhost:${PORT}`)
);
