const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.sortDropdown = '[data-test="product-sort-container"]';
    this.shoppingCartBadge = '[data-test="shopping-cart-badge"]';
    this.inventoryItems = '.inventory_item';
    this.productTitle = '[data-test="inventory-item-name"]';
    this.productPrice = '[data-test="inventory-item-price"]';
  }

  async sortProducts(sortOption) {
    await this.selectOption(this.sortDropdown, sortOption);
  }

  async sortByPriceLowToHigh() {
    await this.sortProducts('lohi');
  }

  async sortByPriceHighToLow() {
    await this.sortProducts('hilo');
  }

  async sortByNameAtoZ() {
    await this.sortProducts('az');
  }

  async getCurrentSortOption() {
    return await this.getInputValue(this.sortDropdown);
  }

  // convert product name to kebab-case for button selectors
  convertToKebabCase(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  getAddToCartButtonSelector(productName) {
    const kebabName = this.convertToKebabCase(productName);
    return `[data-test="add-to-cart-${kebabName}"]`;
  }

  getRemoveButtonSelector(productName) {
    const kebabName = this.convertToKebabCase(productName);
    return `[data-test="remove-${kebabName}"]`;
  }

  async addToCart(productName) {
    const addButton = this.getAddToCartButtonSelector(productName);
    await this.click(addButton);
  }

  async addMultipleToCart(productNames) {
    for (const productName of productNames) {
      await this.addToCart(productName);
    }
  }

  async removeFromCart(productName) {
    const removeButton = this.getRemoveButtonSelector(productName);
    await this.click(removeButton);
  }

  async removeMultipleFromCart(productNames) {
    for (const productName of productNames) {
      await this.removeFromCart(productName);
    }
  }

  async getCartItemCount() {
    const badgeVisible = await this.isVisible(this.shoppingCartBadge);
    if (!badgeVisible) {
      return 0;
    }
    const badgeText = await this.getText(this.shoppingCartBadge);
    return parseInt(badgeText, 10);
  }

  async verifyCartItemCount(expectedCount) {
    const actualCount = await this.getCartItemCount();
    return actualCount === expectedCount;
  }

  async isCartEmpty() {
    return (await this.getCartItemCount()) === 0;
  }

  // check if remove button exists = product in cart
  async isProductInCart(productName) {
    const removeButton = this.getRemoveButtonSelector(productName);
    return await this.isVisible(removeButton);
  }

  async verifyMultipleProductsInCart(productNames) {
    for (const productName of productNames) {
      const inCart = await this.isProductInCart(productName);
      if (!inCart) {
        return false;
      }
    }
    return true;
  }

  async getAllProductNames() {
    const products = await this.page.$$(this.productTitle);
    const names = [];
    for (const product of products) {
      const text = await product.textContent();
      names.push(text.trim());
    }
    return names;
  }

  async getProductCount() {
    return await this.page.locator(this.inventoryItems).count();
  }

  async getProductPrice(productName) {
    const products = await this.page.$$(this.inventoryItems);
    for (const product of products) {
      const titleElement = await product.$(this.productTitle);
      const title = await titleElement.textContent();
      if (title.trim() === productName) {
        const priceElement = await product.$(this.productPrice);
        return await priceElement.textContent();
      }
    }
    return null;
  }
}

module.exports = ProductsPage;
