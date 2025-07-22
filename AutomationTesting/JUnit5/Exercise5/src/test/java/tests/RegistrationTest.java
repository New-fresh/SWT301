package tests;

import org.junit.jupiter.api.*;
import quangnc.example.pages.RegistrationPage;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RegistrationTest extends BaseTest {
    static RegistrationPage regPage;

    @BeforeAll
    public static void init() {
        regPage = new RegistrationPage(driver);
    }

    @Test
    @DisplayName("Should submit registration form successfully")
    public void testFormSubmission() {
        regPage.navigate();
        regPage.fillForm("John", "Doe", "0999999999");
        regPage.submit();
        assertEquals("Thanks for submitting the form", regPage.getModalTitle());
    }
}


