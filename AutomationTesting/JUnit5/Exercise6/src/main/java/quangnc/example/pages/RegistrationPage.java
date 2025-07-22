package quangnc.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegistrationPage extends BasePage {

    public RegistrationPage(WebDriver driver) {
        super(driver);
    }

    private By nameInput = By.id("name");
    private By emailInput = By.id("email");
    private By passwordInput = By.id("password");
    private By confirmInput = By.id("confirm");
    private By registerButton = By.xpath("//button[@type='submit']");
    private By successMessage = By.id("successMsg");
    private By errorMessage = By.id("errorMsg");

    public void navigateToRegistrationPage() {
        driver.get("file:///C:/Users/Asus/Desktop/registration.html");
    }

    public void enterRegistrationDetails(String name, String email, String password, String confirmPassword) {
        type(nameInput, name);
        type(emailInput, email);
        type(passwordInput, password);
        type(confirmInput, confirmPassword);
    }

    public void submitRegistration() {
        click(registerButton);
    }

    public String getSuccessMessage() {
        return waitForVisibility(successMessage).getText();
    }

    public String getErrorMessage() {
        return waitForVisibility(errorMessage).getText();
    }
}

