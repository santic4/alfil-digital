export class ProductDTO {
    constructor(prod) {
      this._id = prod._id;
      this.title = prod.title;
      this.description = prod.description;
      this.priceARS = prod.priceARS;
      this.priceUSD = prod.priceUSD;
      this.status = prod.status; 
      this.category = prod.category;
      this.images = prod.images; 
      this.position = prod.position; 
      this.featured = prod.featured;
    }
}