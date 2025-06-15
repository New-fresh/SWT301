package quangnc.example;

import java.util.logging.Logger;

// Dùng class thay vì interface
class Constants {
    public static final int MAX_USERS = 100;
}

public class InterfaceFieldModificationExample {
    private static final Logger LOGGER = Logger.getLogger(InterfaceFieldModificationExample.class.getName());

    public static void main(String[] args) {

        for (int i = 1; i <= Constants.MAX_USERS; i += 50) {
            LOGGER.info("Processing user batch: " + i);
        }
    }
}

