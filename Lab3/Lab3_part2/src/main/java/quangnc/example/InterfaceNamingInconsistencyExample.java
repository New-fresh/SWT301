package quangnc.example;

// Interface tuân thủ PascalCase
interface LoginHandler {
    boolean login(String username, String password);
}

class SimpleLoginHandler implements LoginHandler {
    @Override
    public boolean login(String username, String password) {
        return "admin".equals(username) && "abcd".equals(password);
    }
}

public class InterfaceNamingInconsistencyExample {
    public static void main(String[] args) {
        LoginHandler handler = new SimpleLoginHandler();
        System.out.println("Login success: " + handler.login("admin", "abcd"));
    }
}

