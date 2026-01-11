require('dotenv').config();
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
    this.errorMessage = '[data-test="error"]';
    
    this.users = {
      standard: { 
        username: process.env.STANDARD_USER || 'standard_user', 
        password: process.env.PASSWORD || 'secret_sauce' 
      },
      locked: { 
        username: process.env.LOCKED_USER || 'locked_out_user', 
        password: process.env.PASSWORD || 'secret_sauce' 
      },
      problem: { 
        username: process.env.PROBLEM_USER || 'problem_user', 
        password: process.env.PASSWORD || 'secret_sauce' 
      },
      performance: { 
        username: process.env.PERFORMANCE_USER || 'performance_glitch_user', 
        password: process.env.PASSWORD || 'secret_sauce' 
      },
      error: { 
        username: process.env.ERROR_USER || 'error_user', 
        password: process.env.PASSWORD || 'secret_sauce' 
      },
      visual: { 
        username: process.env.VISUAL_USER || 'visual_user', 
        password: process.env.PASSWORD || 'secret_sauce' 
      }
    };
  }

  async goto() {
    await this.navigate('/');
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async loginAsStandardUser() {
    await this.login(this.users.standard.username, this.users.standard.password);
  }

  async loginByUserType(userType) {
    if (!this.users[userType]) {
      throw new Error(`Unknown user type: ${userType}`);
    }
    await this.login(this.users[userType].username, this.users[userType].password);
  }

  async isErrorDisplayed() {
    return await this.isVisible(this.errorMessage);
  }

  async getErrorMessage() {
    if (await this.isErrorDisplayed()) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  async isLoginSuccessful() {
    return this.page.url().includes('inventory.html');
  }
}

module.exports = LoginPage;
