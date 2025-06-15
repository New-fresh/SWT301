package quangnc.example;

import java.util.Scanner;
import java.util.logging.Logger;

public class HardcodedCredentialsExample {
    private static final Logger LOGGER = Logger.getLogger(HardcodedCredentialsExample.class.getName());

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        LOGGER.info("Please enter your credentials.");

        System.out.print("Username: ");
        String inputUsername = sc.nextLine();

        System.out.print("Password: ");
        String inputPassword = sc.nextLine();

        if (authenticate(inputUsername, inputPassword)) {
            LOGGER.info("Access granted.");
        } else {
            LOGGER.warning("Access denied.");
        }

        sc.close();
    }

    private static boolean authenticate(String user, String pass) {
        String envUser = System.getenv("APP_USERNAME");
        String envPass = System.getenv("APP_PASSWORD");

        if (envUser == null || envPass == null) {
            LOGGER.severe("Environment variables APP_USERNAME or APP_PASSWORD not set.");
            return false;
        }

        return user.equals(envUser) && pass.equals(envPass);
    }
}

