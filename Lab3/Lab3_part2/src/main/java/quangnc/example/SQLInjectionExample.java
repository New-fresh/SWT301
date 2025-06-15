package quangnc.example;

import java.sql.*;
import java.util.logging.Logger;

public class SQLInjectionExample {
    private static final Logger LOGGER = Logger.getLogger(SQLInjectionExample.class.getName());

    public static void main(String[] args) {
        String userInput = "' OR '1'='1"; // Dữ liệu đầu vào nguy hiểm mô phỏng

        // Đọc thông tin kết nối từ biến môi trường
        String dbUser = System.getenv("DB_USER");
        String dbPass = System.getenv("DB_PASS");

        // Thêm dòng này để tắt SSL
        String url = "jdbc:sqlserver://localhost:1433;databaseName=mydb;encrypt=false";

        try (Connection conn = DriverManager.getConnection(url, dbUser, dbPass)) {

            String sql = "SELECT username FROM users WHERE username = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, userInput);

                LOGGER.info("Executing parameterized query.");

                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        LOGGER.info("Found user: " + rs.getString("username"));
                    }
                }
            }

        } catch (SQLException e) {
            LOGGER.severe("Database error: " + e.getMessage());
        }
    }
}


