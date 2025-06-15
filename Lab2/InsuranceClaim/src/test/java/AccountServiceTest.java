import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import quangnc.example.AccountService;

public class AccountServiceTest {

    static AccountService service;

    @BeforeAll
    static void setup() {
        service = new AccountService();
    }

    //  Kiểm thử chính bằng dữ liệu từ file CSV
    @ParameterizedTest(name = "Test {index}: register({0}, {1}, {2}) => {3}")
    @CsvFileSource(resources = "/test-data.csv", numLinesToSkip = 1)
    void testRegisterAccount(String username, String password, String email, boolean expected) {
        boolean result = service.registerAccount(username, password, email);
        assertEquals(expected, result,
                () -> "Expected: " + expected + ", but got: " + result);
    }

    //  Kiểm thử các email hợp lệ
    @Test
    void testIsValidEmail_validCases() {
        assertTrue(service.isValidEmail("test@example.com")); // email hợp lệ
        assertTrue(service.isValidEmail("user.name@domain.co")); // email hợp lệ dạng khác
    }

    //  Kiểm thử các email không hợp lệ
    @Test
    void testIsValidEmail_invalidCases() {
        assertFalse(service.isValidEmail("invalid-email")); // thiếu @ và domain
        assertFalse(service.isValidEmail("user@domain")); // thiếu đuôi .com
        assertFalse(service.isValidEmail("user@.com")); // thiếu domain
        assertFalse(service.isValidEmail("")); // chuỗi rỗng
        assertFalse(service.isValidEmail(null)); // null
    }

    //  Kiểm thử đăng ký với mật khẩu rỗng
    @Test
    void testRegisterAccount_emptyPassword() {
        boolean result = service.registerAccount("john", "", "john@example.com");
        assertFalse(result); // vì mật khẩu rỗng
    }

    //  Kiểm thử đăng ký với email null
    @Test
    void testRegisterAccount_nullEmail() {
        boolean result = service.registerAccount("john", "password123", null);
        assertFalse(result); // vì email null
    }

    //  Kiểm thử đăng ký với mật khẩu dài đúng 7 ký tự (hợp lệ)
    @Test
    void testRegisterAccount_passwordLengthExactly7() {
        boolean result = service.registerAccount("john", "pass777",
                "john@example.com");
        assertTrue(result); // đúng vì pass có 7 ký tự
    }

    //  Kiểm thử đăng ký với email chứa dấu + (email hợp lệ)
    @Test
    void testRegisterAccount_specialCharEmail() {
        boolean result = service.registerAccount("john", "password123",
                "john.doe+test@domain.co");
        assertTrue(result); // email có + vẫn hợp lệ
    }



}

