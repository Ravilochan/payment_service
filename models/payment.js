const mongoose = require("mongoose");
const { ObjectId, Mixed } = mongoose.Schema.Types;

const paymentSchema = mongoose.Schema({
  user: { type: ObjectId },
  data: { type: Mixed },
  product: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
