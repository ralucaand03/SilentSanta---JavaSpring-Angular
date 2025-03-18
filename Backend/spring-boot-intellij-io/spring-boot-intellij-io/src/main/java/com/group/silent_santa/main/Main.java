package com.group.silent_santa.main;

import com.group.silent_santa.controller.LogInController;
import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.RequestsRepository;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.service.LettersService;
import com.group.silent_santa.service.RequestsService;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.LogInView;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Arrays;


@SpringBootApplication(scanBasePackages = "com.group.silent_santa")
public class Main {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Main.class, args);
        UsersRepository usersRepo = context.getBean(UsersRepository.class);
        LettersRepository lettersRepository = context.getBean(LettersRepository.class);
        RequestsRepository requestsRepo = context.getBean(RequestsRepository.class);
        UsersService usersService = context.getBean(UsersService.class);
        LettersService lettersService = context.getBean(LettersService.class);
        RequestsService requestsService = context.getBean(RequestsService.class);
        LogInController logInController = context.getBean(LogInController.class);
        LogInView logInView = new LogInView(logInController);
        logInController.setView(logInView);
    }
}
//        String email = "jane.doe@example.com";
//        if (!usersRepo.existsByEmail(email)) {
//            // Let JPA handle ID assignment
//            UsersModel user = new UsersModel();
//            user.setFirstName("Jane");
//            user.setLastName("Doe");
//            user.setEmail(email);
//            user.setPhone("1234567890");
//            user.setPassword("password123"); // TODO: hash this in real app!
//            user.setRole(Role.ADMIN);
//
//            usersRepo.save(user);
//            System.out.println("✔ Admin user saved to database.");
//        } else {
//            System.out.println("⚠ User with email already exists!");
//        }
//        SignUpView[] viewRef = new SignUpView[1];
//        SignUpController controller = context.getBean(SignUpController.class);
//        SignUpView view = new SignUpView(controller);
//        controller.setView(view);
//
//        viewRef[0] = new SignUpView(controller);
//        controller.setView(viewRef[0]);
//context.close();

// 1) Ensure you have an admin user to "post" letters
//    This is just an example check – replace with your own logic
//UsersModel adminUser = usersService.getAdminUser();
//        if (adminUser == null) {
//        System.out.println("No admin user found. Creating a dummy admin...");
//
//UsersModel newAdmin = new UsersModel();
//            newAdmin.setFirstName("John");
//            newAdmin.setLastName("Doe");
//            newAdmin.setEmail("admin@example.com");
//            newAdmin.setRole(UsersModel.Role.ADMIN);
//// set a raw password
//String rawPassword = "admin123";
//// store encoded
//            newAdmin.setPassword(usersService.encodePassword(rawPassword));
//        usersService.registerUser(newAdmin);
//adminUser = newAdmin;
//        }
//
//// 2) Create some sample letters if none exist
//long letterCount = lettersRepository.count();
//        if (letterCount == 0) {
//        System.out.println("No letters found. Adding some sample letters...");
//
//LettersModel letter1 = new LettersModel(
//        "Holiday Wishes",
//        Arrays.asList("Toy Car", "Train Set"),
//        "Timmy",
//        LettersModel.LetterStatus.ACTIVE,
//        adminUser
//);
//            lettersService.saveLetter(letter1);
//
//LettersModel letter2 = new LettersModel(
//        "Summer Gifts",
//        Arrays.asList("Basketball", "Swimsuit"),
//        "Emily",
//        LettersModel.LetterStatus.ACTIVE,
//        adminUser
//);
//            lettersService.saveLetter(letter2);
//
//LettersModel letter3 = new LettersModel(
//        "Birthday Dreams",
//        Arrays.asList("Doll", "Cake", "Balloons"),
//        "Sarah",
//        LettersModel.LetterStatus.INACTIVE,
//        adminUser
//);
//            lettersService.saveLetter(letter3);
//
//            System.out.println("Sample letters added to the database!");
//        } else {
//                System.out.println("Letters already exist in the database. Not adding samples.");
//        }

