export class TransactionDTO {
    constructor(trans) {
      this.id = trans._id;
      this.cart = trans.cart;
      this.status = trans.status;
      this.email = trans.emailSend;
    }
}

export default TransactionDTO;