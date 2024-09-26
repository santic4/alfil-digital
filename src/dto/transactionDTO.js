export class TransactionDTO {
    constructor(trans) {
      this.id = trans._id;
      this.cart = trans.carrito;
      this.status = trans.status;
      this.email = trans.emailSend;
      this.clientData = trans.clientData
      this.total = trans.total
    }
}

export default TransactionDTO;