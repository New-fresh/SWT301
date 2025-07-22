package quangnc.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    private By emailInput = By.id("email"); // chỉnh theo id thực tế nếu khác
    private By passwordInput = By.id("password");
    private By loginButton = By.id("loginButton"); // hoặc nút submit

    private By errorMsg = By.className("error-message"); // optional

    public void navigateToLoginPage() {
        driver.get("file:///C:/Users/Asus/Desktop/login.html");
    }


    public void enterCredentials(String email, String password) {
        type(emailInput, email);
        type(passwordInput, password);
    }

    public void submitLogin() {
        click(loginButton);
    }

    public String getErrorMessage() {
        return getText(errorMsg);
    }
}

