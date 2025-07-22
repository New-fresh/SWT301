package quangnc.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

public class RegistrationPage extends BasePage {

    public RegistrationPage(WebDriver driver) {
        super(driver);
    }

    private By firstName = By.id("firstName");
    private By lastName = By.id("lastName");
    private By genderMale = By.xpath("//label[text()='Male']");
    private By userNumber = By.id("userNumber");
    private By submitBtn = By.id("submit");
    private By modalTitle = By.id("example-modal-sizes-title-lg");

    public void navigate() {
        driver.get("https://demoqa.com/automation-practice-form");

        // Chờ 1-2 giây để iframe quảng cáo xuất hiện
        try {
            Thread.sleep(1500); // Chờ 1.5s để iframe load
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Xóa tất cả iframe nếu có
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript(
                "document.querySelectorAll('iframe').forEach(frame => frame.remove());" +
                        "let ad = document.getElementById('google_ads_iframe_/21849154601,22343295815/" +
                        "Ad.Plus-Anchor_0');" +
                        "if(ad) ad.remove();"
        );
    }



    public void fillForm(String fname, String lname, String number) {
        type(firstName, fname);
        type(lastName, lname);

        scrollIntoView(genderMale); // đảm bảo nhìn thấy
        try {
            Thread.sleep(500); // chờ DOM ổn định
        } catch (InterruptedException e) {}

        click(genderMale);
        type(userNumber, number);
    }


    public void submit() {
        scrollIntoView(submitBtn);
        click(submitBtn);
    }

    public String getModalTitle() {
        return waitForVisibility(modalTitle).getText();
    }
}


