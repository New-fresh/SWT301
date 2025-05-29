import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import quangnc.example.Calculator;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Test Calculator - JUnit Lifecycle Demo")
public class CalculatorTest {

    static Calculator calculator;

    @BeforeAll
    static void initAll() {
        System.out.println("⚙ @BeforeAll - Khởi tạo Calculator");
        calculator = new Calculator();
    }

    @AfterAll
    static void cleanupAll() {
        System.out.println(" @AfterAll - Dọn dẹp Calculator");
        calculator = null;
    }

    @BeforeEach
    void beforeEachTest() {
        System.out.println("➡ @BeforeEach - Chuẩn bị test");
    }

    @AfterEach
    void afterEachTest() {
        System.out.println("⬅ @AfterEach - Kết thúc test");
    }

    @Test
    @DisplayName(" Kiểm tra phép cộng với hai số dương")
    void testAddition() {
        assertEquals(5, calculator.add(2, 3), "Addition should return 5");
    }

    @Test
    @DisplayName(" Kiểm tra chia hợp lệ")
    void testDivide() {
        assertEquals(2, calculator.divide(6, 3));
    }

    @Test
    @DisplayName(" Kiểm tra chia cho 0")
    void testDivideByZero() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            calculator.divide(10, 0);
        });
        assertEquals("Cannot divide by zero", exception.getMessage());
    }
}
