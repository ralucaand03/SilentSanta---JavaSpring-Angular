package com.group.silent_santa.controller;

import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.AdminDashboardView;
import com.group.silent_santa.view.LettersView;
import com.group.silent_santa.view.UsersView;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.ObjectProvider;
@Component
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UsersService usersService;
    private final ObjectProvider<LettersController> lettersControllerProvider;
    private final ObjectProvider<UsersController> usersControllerProvider;

    @Setter
    private AdminDashboardView view;

    public void onViewUsers(AdminDashboardView view) {
        UsersController usersController = usersControllerProvider.getObject();
        UsersView usersView = new UsersView(usersController);
        view.getFrame().dispose();
    }

    public void onViewLetters(AdminDashboardView view) {
        LettersController lettersController = lettersControllerProvider.getObject();
        LettersView lettersView = new LettersView(lettersController);
        lettersController.loadLetters(lettersView);
        view.getFrame().dispose();
    }

    public void openDashboard() {
        new AdminDashboardView(this);
    }

    public void onViewRequests(AdminDashboardView adminDashboardView) {
    }
}
