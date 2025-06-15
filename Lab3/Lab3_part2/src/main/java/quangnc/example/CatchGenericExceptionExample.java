package quangnc.example;

import java.util.logging.Logger;

public class CatchGenericExceptionExample {
    private static final Logger LOGGER = Logger.getLogger(CatchGenericExceptionExample.class.getName());

    public static void main(String[] args) {
        try {
            String s = null;
            System.out.println(s.length()); // dòng này để cố tình gây lỗi NullPointerException
        } catch (NullPointerException e) {
            LOGGER.severe("Đã xảy ra lỗi NullPointerException: " + e.getMessage());
        }
    }
}

