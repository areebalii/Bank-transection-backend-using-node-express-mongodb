import TransactionModel from "../models/transaction.model.js";
import LedgerModel from "../models/ledger.model.js";
import AccountModel from "../models/account.model.js";

export const createTransaction = async (req, res) => {
  try {
    // Validate Request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "Missing required fields: fromAccount, toAccount, amount, idempotencyKey"
      });
    }
  
    const fromUserAccount = await AccountModel.findOne({ _id: fromAccount });
    const toUserAccount = await AccountModel.findOne({ _id: toAccount });
  
    if (!fromUserAccount || !toUserAccount) { 
      return res.status(400).json({
        message: "fromAccount or toAccount not found"
      });

      //Validate idempotency key 
      const isTransactionAlreadyExist = await TransactionModel.findOne({ idempotencyKey });
      if (isTransactionAlreadyExist) {
        if (isTransactionAlreadyExist.status === "COMPLETED") {
          return res.status(200).json({
            message: "Transaction already completed",
            transaction: isTransactionAlreadyExist
          });
        }

        if (isTransactionAlreadyExist.status === "PENDING") {
          return res.status(400).json({
            message: "Transaction with the same idempotency key is already in progress",
          });
        }

        if (isTransactionAlreadyExist.status === "FAILED") {
          return res.status(400).json({
            message: "Transaction failed previously please try again",
          });
        }

        if (isTransactionAlreadyExist.status === "REVERSED") {
          return res.status(400).json({
            message: "Transaction was reversed previously please try again",
          });
        }




      }

      // check account status
      if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
          message: "Both fromAccount and toAccount must be active"
        });
      }

    // derive sender balance from ledger
      const balance = await fromUserAccount.getBalance();
      if (balance < amount) { 
        return res.status(400).json({
          message: `Insufficient balance. Current balance is ${balance} and requested amount is ${amount}`
        });
      }
     

    } 
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      message: "Error occurred while creating transaction"
    });
  }};