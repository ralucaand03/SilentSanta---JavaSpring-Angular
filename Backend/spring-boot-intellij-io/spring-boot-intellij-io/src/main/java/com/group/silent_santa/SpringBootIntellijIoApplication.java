package com.group.silent_santa;

import com.group.silent_santa.main.Main;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.UsersRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class SpringBootIntellijIoApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(SpringBootIntellijIoApplication.class, args);

		UsersRepository usersRepository = context.getBean(UsersRepository.class);

		UsersModel user = new UsersModel("Jane", "Doe", "jane.doe@email.com", "0700000000", "1234", UsersModel.Role.ADMIN);
		usersRepository.save(user);

		System.out.println("✔ User saved to DB!");
	}
}
