package quangnc.example;

import java.util.logging.Logger;

interface Shape {
    void draw();
    void resize();
}

class Square implements Shape {
    private static final Logger LOGGER = Logger.getLogger(Square.class.getName());

    @Override
    public void draw() {
        LOGGER.info("Drawing square");
    }

    @Override
    public void resize() {
        LOGGER.info("Resizing square");
    }
}

public class IncompleteInterfaceImplementationExample {
    public static void main(String[] args) {
        Shape square = new Square();
        square.draw();
        square.resize();
    }
}
