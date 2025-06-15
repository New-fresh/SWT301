package quangnc.example;

import java.util.logging.Logger;

public class OvercatchingExceptionExample {
    private static final Logger LOGGER = Logger.getLogger(OvercatchingExceptionExample.class.getName());

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};

        // indexToAccess thay đổi theo tham số dòng lệnh để IDE không chắc chắn giá trị
        int indexToAccess = args.length > 0 ? Integer.parseInt(args[0]) : 2;

        if (indexToAccess >= 0 && indexToAccess < arr.length) {
            LOGGER.info("Giá trị tại vị trí " + indexToAccess + ": " + arr[indexToAccess]);
        } else {
            LOGGER.warning("Chỉ số " + indexToAccess + " vượt quá giới hạn mảng.");
        }
    }
}


