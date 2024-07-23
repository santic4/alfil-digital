export class TransactionDTO {
    constructor(trans) {
      this.id = trans._id;
      this.cart = trans.carrito;
      this.status = trans.status;
      this.email = trans.emailSend;
    }
}

export default TransactionDTO;