const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');

test.describe('Products Tests', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test.describe('Cart Operations', () => {
    test('add single product to cart', async () => {
      await productsPage.addToCart('Sauce Labs Backpack');
      
      expect(await productsPage.getCartItemCount()).toBe(1);
      expect(await productsPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
    });

    test('add multiple products at once', async () => {
      const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt'
      ];
      
      await productsPage.addMultipleToCart(products);
      
      expect(await productsPage.getCartItemCount()).toBe(3);
      expect(await productsPage.verifyMultipleProductsInCart(products)).toBe(true);
    });

    test('remove single product from cart', async () => {
      await productsPage.addToCart('Sauce Labs Backpack');
      expect(await productsPage.getCartItemCount()).toBe(1);
      
      await productsPage.removeFromCart('Sauce Labs Backpack');
      
      expect(await productsPage.getCartItemCount()).toBe(0);
      expect(await productsPage.isProductInCart('Sauce Labs Backpack')).toBe(false);
    });

    test('remove multiple products from cart', async () => {
      const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt'
      ];
      
      await productsPage.addMultipleToCart(products);
      expect(await productsPage.getCartItemCount()).toBe(3);
      
      await productsPage.removeMultipleFromCart(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
      
      expect(await productsPage.getCartItemCount()).toBe(1);
      expect(await productsPage.isProductInCart('Sauce Labs Bolt T-Shirt')).toBe(true);
    });

    test('cart is empty on login', async () => {
      expect(await productsPage.isCartEmpty()).toBe(true);
      expect(await productsPage.getCartItemCount()).toBe(0);
    });

    test('cart count updates correctly', async () => {
      await productsPage.addToCart('Sauce Labs Backpack');
      expect(await productsPage.verifyCartItemCount(1)).toBe(true);
      
      await productsPage.addToCart('Sauce Labs Bike Light');
      expect(await productsPage.verifyCartItemCount(2)).toBe(true);
      
      await productsPage.addToCart('Sauce Labs Bolt T-Shirt');
      expect(await productsPage.verifyCartItemCount(3)).toBe(true);
    });

    test('add and remove same product multiple times', async () => {
      await productsPage.addToCart('Sauce Labs Backpack');
      expect(await productsPage.getCartItemCount()).toBe(1);
      
      await productsPage.removeFromCart('Sauce Labs Backpack');
      expect(await productsPage.getCartItemCount()).toBe(0);
      
      await productsPage.addToCart('Sauce Labs Backpack');
      expect(await productsPage.getCartItemCount()).toBe(1);
    });

    test('add all available products', async () => {
      const allProducts = await productsPage.getAllProductNames();
      
      await productsPage.addMultipleToCart(allProducts);
      
      expect(await productsPage.getCartItemCount()).toBe(allProducts.length);
    });
  });

  test.describe('Sorting', () => {
    test('sort by name A-Z', async () => {
      await productsPage.sortByNameAtoZ();
      
      expect(await productsPage.getCurrentSortOption()).toBe('az');
    });

    test('sort by price low to high', async () => {
      await productsPage.sortByPriceLowToHigh();
      
      expect(await productsPage.getCurrentSortOption()).toBe('lohi');
    });

    test('sort by price high to low', async () => {
      await productsPage.sortByPriceHighToLow();
      
      expect(await productsPage.getCurrentSortOption()).toBe('hilo');
    });

    test('cart items persist after sorting', async () => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.addToCart('Sauce Labs Bike Light');
      expect(await productsPage.getCartItemCount()).toBe(2);
      
      await productsPage.sortByPriceLowToHigh();
      
      expect(await productsPage.getCartItemCount()).toBe(2);
      expect(await productsPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
      expect(await productsPage.isProductInCart('Sauce Labs Bike Light')).toBe(true);
    });

    test('change sort options multiple times', async () => {
      await productsPage.sortByNameAtoZ();
      expect(await productsPage.getCurrentSortOption()).toBe('az');
      
      await productsPage.sortByPriceLowToHigh();
      expect(await productsPage.getCurrentSortOption()).toBe('lohi');
      
      await productsPage.sortByPriceHighToLow();
      expect(await productsPage.getCurrentSortOption()).toBe('hilo');
    });
  });

  test.describe('Product Information', () => {
    test('get all product names', async () => {
      const allProducts = await productsPage.getAllProductNames();
      
      expect(allProducts.length).toBe(6);
      expect(allProducts).toContain('Sauce Labs Backpack');
      expect(allProducts).toContain('Sauce Labs Bike Light');
      expect(allProducts).toContain('Sauce Labs Bolt T-Shirt');
      expect(allProducts).toContain('Sauce Labs Fleece Jacket');
      expect(allProducts).toContain('Sauce Labs Onesie');
      expect(allProducts).toContain('Test.allTheThings() T-Shirt (Red)');
    });

    test('get product count', async () => {
      const productCount = await productsPage.getProductCount();
      
      expect(productCount).toBe(6);
    });

    test('get Fleece Jacket price', async () => {
      const price = await productsPage.getProductPrice('Sauce Labs Fleece Jacket');
      
      expect(price).toBe('$49.99');
    });

    test('get Onesie price', async () => {
      const price = await productsPage.getProductPrice('Sauce Labs Onesie');
      
      expect(price).toBe('$7.99');
    });

    test('get Backpack price', async () => {
      const price = await productsPage.getProductPrice('Sauce Labs Backpack');
      
      expect(price).toBe('$29.99');
    });

    test('verify all expected products exist', async () => {
      const expectedProducts = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
      ];
      
      const allProducts = await productsPage.getAllProductNames();
      
      for (const product of expectedProducts) {
        expect(allProducts).toContain(product);
      }
    });

    test('get all product prices', async () => {
      const productPrices = {
        'Sauce Labs Backpack': '$29.99',
        'Sauce Labs Bike Light': '$9.99',
        'Sauce Labs Bolt T-Shirt': '$15.99',
        'Sauce Labs Fleece Jacket': '$49.99',
        'Sauce Labs Onesie': '$7.99',
        'Test.allTheThings() T-Shirt (Red)': '$15.99'
      };
      
      for (const [productName, expectedPrice] of Object.entries(productPrices)) {
        const actualPrice = await productsPage.getProductPrice(productName);
        expect(actualPrice).toBe(expectedPrice);
      }
    });
  });
});
