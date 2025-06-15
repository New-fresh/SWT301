package quangnc.example;

import java.util.logging.Logger;

public class NullPointerExample {
    private static final Logger LOGGER = Logger.getLogger(NullPointerExample.class.getName());

    public static void main(String[] args) {
        String text = fetchText();

        if (text != null && !text.isEmpty()) {
            LOGGER.info("Text is not empty");
        } else {
            LOGGER.warning("Chuỗi đang null hoặc rỗng");
        }
    }

    // Mô phỏng một hàm trả về null hoặc chuỗi thực tế
    private static String fetchText() {
        return Math.random() > 0.5 ? "Hello" : null;
    }
}


