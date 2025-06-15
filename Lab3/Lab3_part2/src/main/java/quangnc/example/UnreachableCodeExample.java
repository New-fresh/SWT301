package quangnc.example;

import java.util.logging.Logger;

public class UnreachableCodeExample {
    private static final Logger LOGGER = Logger.getLogger(UnreachableCodeExample.class.getName());
    private static final int NUMBER = 42;
    // System.out.println("This will never execute"); // Đã bị xóa vì không bao giờ chạy


    public static void main(String[] args) {
        LOGGER.info("Số trả về là: " + NUMBER);
    }
}


