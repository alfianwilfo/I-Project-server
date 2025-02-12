let axios = require("axios");
let { Transaction, User } = require("../models/index");
class Payment {
  static async getPayRequest(req, res, next) {
    try {
      // let inf = infin
      // let { email } = req.headers;
      const randomId = Math.floor(Math.random() * 10000000);
      let orderId = `PASS-${randomId}`;
      let url = "https://app.sandbox.midtrans.com/snap/v1/transactions";
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic U0ItTWlkLXNlcnZlci05cGtlMVdZRFFqcjlmcklfTTU5bHl2Umg6`,
        },
      };
      const body = {
        transaction_details: {
          order_id: orderId, // id order // increment
          gross_amount: 10000, // total price
        },
        credit_card: {
          secure: true,
        },
      };
      const { data } = await axios.post(url, body, config);
      res.status(200).json({ data, orderId });
    } catch (error) {
      next(error);
    }
  }
  //!https://www.google.com/?status_code=200&transaction_status=settlement&merchant_id=G841758511&order_id=PASS-6499107
  static async postPayment(req, res, next) {
    try {
      let { email, token, orderId } = req.body;
      await Transaction.create({
        email,
        token,
        orderId,
      });
      res.status(201).json({ message: "payment added to database" });
      // console.log(req.body);
    } catch (error) {
      next(error);
    }
  }
  static async pay(req, res, next) {
    try {
      let { order_id } = req.query;
      // console.log(order_id);
      let findTransaction = await Transaction.findOne({
        where: { orderId: order_id },
      });
      let update = await User.update(
        { status: "Premium" },
        { where: { email: findTransaction.email } }
      );
      res.status(201).json({ message: "YOUR ACCOUNT ALREADY PREMIUM" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Payment;
