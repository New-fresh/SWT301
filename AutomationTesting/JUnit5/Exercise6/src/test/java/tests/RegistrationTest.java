package tests;

import org.junit.jupiter.api.*;
import quangnc.example.pages.RegistrationPage;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RegistrationTest extends BaseTest {

    RegistrationPage registrationPage;

    @BeforeEach
    public void setupTest() {
        registrationPage = new RegistrationPage(driver);
        registrationPage.navigateToRegistrationPage();
    }

    @Test
    @DisplayName("Successful Registration")
    @Order(1)
    public void testSuccessfulRegistration() throws InterruptedException {
        registrationPage.enterRegistrationDetails("Alice", "alice@example.com", "123456", "123456");
        registrationPage.submitRegistration();

        Thread.sleep(3000); // xem kết quả
        assertEquals("Registration successful!", registrationPage.getSuccessMessage());
    }

    @Test
    @DisplayName("Password mismatch should fail")
    @Order(2)
    public void testPasswordMismatch() throws InterruptedException {
        registrationPage.enterRegistrationDetails("Bob", "bob@example.com", "123456", "000000");
        registrationPage.submitRegistration();

        Thread.sleep(3000);
        assertEquals("Passwords do not match.", registrationPage.getErrorMessage());
    }

    @Test
    @DisplayName("Empty fields should fail")
    @Order(3)
    public void testEmptyFields() throws InterruptedException {
        registrationPage.enterRegistrationDetails("", "", "", "");
        registrationPage.submitRegistration();

        Thread.sleep(3000);
        assertEquals("Please fill in all fields.", registrationPage.getErrorMessage());
    }
}

