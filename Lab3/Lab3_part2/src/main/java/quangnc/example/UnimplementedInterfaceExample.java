package quangnc.example;

import java.util.logging.Logger;

interface Drawable {
    void draw();
}

class Circle implements Drawable {
    // Tạo logger cho lớp Circle
    private static final Logger LOGGER = Logger.getLogger(Circle.class.getName());

    @Override
    public void draw() {
        LOGGER.info("Drawing a circle.");
    }
}

public class UnimplementedInterfaceExample {
    public static void main(String[] args) {
        Drawable d = new Circle();
        d.draw();
    }
}


