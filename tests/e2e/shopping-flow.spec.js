const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');

test.describe('E2E Shopping Flow', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    await loginPage.goto();
  });

  test('login and add two items to cart', async ({ page }) => {
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/.*inventory.html/);

    await productsPage.addToCart('Sauce Labs Fleece Jacket');
    expect(await productsPage.getCartItemCount()).toBe(1);
    expect(await productsPage.isProductInCart('Sauce Labs Fleece Jacket')).toBe(true);

    await productsPage.addToCart('Sauce Labs Onesie');
    expect(await productsPage.getCartItemCount()).toBe(2);
    expect(await productsPage.isProductInCart('Sauce Labs Onesie')).toBe(true);

    expect(await productsPage.isProductInCart('Sauce Labs Fleece Jacket')).toBe(true);
    expect(await productsPage.isProductInCart('Sauce Labs Onesie')).toBe(true);
  });

  test('complete shopping flow - add and remove items', async ({ page }) => {
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/.*inventory.html/);

    await productsPage.sortByPriceLowToHigh();
    const sortValue = await productsPage.page.inputValue(productsPage.sortDropdown);
    expect(sortValue).toBe('lohi');

    await productsPage.addToCart('Sauce Labs Fleece Jacket');
    expect(await productsPage.getCartItemCount()).toBe(1);
    expect(await productsPage.isProductInCart('Sauce Labs Fleece Jacket')).toBe(true);

    await productsPage.addToCart('Sauce Labs Onesie');
    expect(await productsPage.getCartItemCount()).toBe(2);

    expect(await productsPage.verifyCartItemCount(2)).toBe(true);
    expect(await productsPage.isProductInCart('Sauce Labs Fleece Jacket')).toBe(true);
    expect(await productsPage.isProductInCart('Sauce Labs Onesie')).toBe(true);

    await productsPage.removeFromCart('Sauce Labs Onesie');
    expect(await productsPage.getCartItemCount()).toBe(1);
    expect(await productsPage.isProductInCart('Sauce Labs Onesie')).toBe(false);
    expect(await productsPage.isProductInCart('Sauce Labs Fleece Jacket')).toBe(true);
  });

  test('complete shopping flow with multiple products', async ({ page }) => {
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/.*inventory.html/);

    await productsPage.sortByPriceLowToHigh();

    const productsToAdd = [
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ];
    await productsPage.addMultipleToCart(productsToAdd);

    expect(await productsPage.getCartItemCount()).toBe(3);
    expect(await productsPage.verifyMultipleProductsInCart(productsToAdd)).toBe(true);

    await productsPage.removeFromCart('Sauce Labs Bike Light');
    expect(await productsPage.getCartItemCount()).toBe(2);

    expect(await productsPage.isProductInCart('Sauce Labs Onesie')).toBe(true);
    expect(await productsPage.isProductInCart('Sauce Labs Bolt T-Shirt')).toBe(true);
    expect(await productsPage.isProductInCart('Sauce Labs Bike Light')).toBe(false);
  });
});
