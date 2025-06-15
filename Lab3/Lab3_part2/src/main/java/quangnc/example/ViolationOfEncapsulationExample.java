package quangnc.example;

import java.util.logging.Logger;

class User {
    private static final Logger LOGGER = Logger.getLogger(User.class.getName());

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        } else {
            LOGGER.warning("Tuổi không hợp lệ!");
        }
    }

    public void display() {
        LOGGER.info("Name: " + name + ", Age: " + age);
    }
}

public class ViolationOfEncapsulationExample {
    public static void main(String[] args) {
        User user = new User();
        user.setName("Alice");
        user.setAge(25);
        user.display();

        int currentAge = user.getAge(); // sử dụng getAge để tránh cảnh báo
        Logger.getLogger(ViolationOfEncapsulationExample.class.getName()).info("Tuổi hiện tại: " + currentAge);
    }
}

