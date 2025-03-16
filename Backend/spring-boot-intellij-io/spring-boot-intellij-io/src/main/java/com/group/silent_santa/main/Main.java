package com.group.silent_santa.main;

import com.group.silent_santa.controller.LogInController;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.service.LettersService;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.LogInView;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;


@SpringBootApplication(scanBasePackages = "com.group.silent_santa")
public class Main {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Main.class, args);
        UsersRepository usersRepo = context.getBean(UsersRepository.class);
        LettersRepository lettersRepository = context.getBean(LettersRepository.class);
        UsersService usersService = context.getBean(UsersService.class);
        LettersService lettersService = context.getBean(LettersService.class);

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

