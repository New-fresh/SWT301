package quangnc.example;

import java.io.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ResourceLeakExample {
    private static final Logger LOGGER = Logger.getLogger(ResourceLeakExample.class.getName());

    public static void main(String[] args) {
        File dataFile = new File("data.txt");

        //  Dùng try-with-resources để đảm bảo file được đóng sau khi dùng
        try (BufferedReader reader = new BufferedReader(new FileReader(dataFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                LOGGER.info(line); //  Ghi log thay vì System.out
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, String.format("Error reading file: %s", e.getMessage()), e);//  Ghi log lỗi
        }
    }
}
