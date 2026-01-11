const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Positive Tests', () => {
    test('login with standard user', async ({ page }) => {
      await loginPage.loginAsStandardUser();
      
      expect(await loginPage.isLoginSuccessful()).toBe(true);
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('login using loginByUserType method', async ({ page }) => {
      await loginPage.loginByUserType('standard');
      
      expect(await loginPage.isLoginSuccessful()).toBe(true);
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('login with all valid user types', async ({ page }) => {
      const validUsers = ['standard', 'problem', 'performance', 'error', 'visual'];
      
      for (const userType of validUsers) {
        await loginPage.goto();
        await loginPage.loginByUserType(userType);
        
        expect(await loginPage.isLoginSuccessful()).toBe(true);
        await expect(page).toHaveURL(/.*inventory.html/);
      }
    });
  });

  test.describe('Negative & Edge Cases', () => {
    test('invalid username shows error', async () => {
      await loginPage.login('invalid_user', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Epic sadface');
      expect(errorMsg).toContain('Username and password do not match');
    });

    test('invalid password shows error', async () => {
      await loginPage.login('standard_user', 'wrong_password');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Epic sadface');
      expect(errorMsg).toContain('Username and password do not match');
    });

    test('empty username shows error', async () => {
      await loginPage.login('', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Username is required');
    });

    test('empty password shows error', async () => {
      await loginPage.login('standard_user', '');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Password is required');
    });

    test('both fields empty shows error', async () => {
      await loginPage.login('', '');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Username is required');
    });

    test('locked out user shows error', async () => {
      await loginPage.loginByUserType('locked');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('locked out');
    });

    test('special characters in username', async () => {
      await loginPage.login('user@#$%^&*()', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('special characters in password', async () => {
      await loginPage.login('standard_user', 'pass@#$%^&*()');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('SQL injection in username', async () => {
      await loginPage.login("admin' OR '1'='1", 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('SQL injection in password', async () => {
      await loginPage.login('standard_user', "' OR '1'='1");
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('XSS attempt in username', async () => {
      await loginPage.login('<script>alert("XSS")</script>', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('very long username (500 chars)', async () => {
      const longUsername = 'a'.repeat(500);
      await loginPage.login(longUsername, 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('very long password (500 chars)', async () => {
      const longPassword = 'a'.repeat(500);
      await loginPage.login('standard_user', longPassword);
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('username with spaces at start/end', async () => {
      await loginPage.login('  standard_user  ', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('password with spaces at start/end', async () => {
      await loginPage.login('standard_user', '  secret_sauce  ');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('case sensitive username', async () => {
      await loginPage.login('STANDARD_USER', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('case sensitive password', async () => {
      await loginPage.login('standard_user', 'SECRET_SAUCE');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('unicode characters in username', async () => {
      await loginPage.login('用户名', 'secret_sauce');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });

    test('unicode characters in password', async () => {
      await loginPage.login('standard_user', '密码');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.isLoginSuccessful()).toBe(false);
    });
  });
});
