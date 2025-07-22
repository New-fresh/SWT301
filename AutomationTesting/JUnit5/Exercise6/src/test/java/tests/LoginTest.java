package tests;

import org.junit.jupiter.api.*;
import quangnc.example.pages.LoginPage;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LoginTest extends BaseTest {

    LoginPage loginPage;

    @BeforeEach
    public void setupTest() {
        loginPage = new LoginPage(driver);
        loginPage.navigateToLoginPage();
    }

    @Test
    @DisplayName("Login with valid credentials")
    @Order(1)
    public void testLoginSuccess() throws InterruptedException {
        loginPage.enterCredentials("user@example.com", "password123");
        loginPage.submitLogin();

        Thread.sleep(10000); // 👈 giữ trình duyệt mở 5s để quan sát
    }

    @Test
    @DisplayName("Login with invalid credentials")
    @Order(2)
    public void testLoginFailure() throws InterruptedException {
        loginPage.enterCredentials("wrong@example.com", "wrongpass");
        loginPage.submitLogin();

        Thread.sleep(10000); // 👈 giữ trình duyệt mở 5s để quan sát
    }
}

