package quangnc.example;

import java.io.*;
import java.util.logging.Logger;

public class PathTraversalExample {

    // Tạo Logger thay vì dùng System.out để đúng theo cảnh báo của SonarQube
    private static final Logger LOGGER = Logger.getLogger(PathTraversalExample.class.getName());

    public static void main(String[] args) {
        //   → Giúp tránh lỗi path traversal (cố thoát khỏi thư mục an toàn)
        String userInput = "secret.txt";

        //  Cập nhật đường dẫn thư mục an toàn thành src/main/resources
        //   → Nơi chứa file hợp lệ để đọc
        File safeDirectory = new File("src/main/resources");

        try {
            //  Ghép safeDirectory + userInput rồi chuẩn hóa (loại bỏ ../, vv)
            File targetFile = new File(safeDirectory, userInput).getCanonicalFile();

            //  Kiểm tra nếu file nằm ngoài thư mục an toàn → log lỗi và thoát
            if (!targetFile.getPath().startsWith(safeDirectory.getCanonicalPath())) {
                LOGGER.severe("Invalid file access attempt: " + targetFile.getPath());
                return;
            }

            //  Nếu file tồn tại → đọc từng dòng và in ra bằng LOGGER
            if (targetFile.exists()) {
                BufferedReader reader = new BufferedReader(new FileReader(targetFile));
                LOGGER.info("Reading file: " + targetFile.getPath());

                //  Dòng mới: in từng dòng file ra log (tránh dùng System.out)
                reader.lines().forEach(LOGGER::info);
                reader.close();
            } else {
                //  File không tồn tại → cảnh báo
                LOGGER.warning("File not found: " + targetFile.getPath());
            }

        } catch (IOException e) {
            //  Bắt và ghi log lỗi khi đọc file
            LOGGER.severe("Error reading file: " + e.getMessage());
        }
    }
}

