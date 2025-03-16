package com.group.silent_santa.controller;

import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.UsersView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UsersController {

    private final UsersService usersService;
    private AdminDashboardController adminDashboardController; // no longer final

    private UsersView view;

    // Inject only the *necessary* dependencies via the constructor
    @Autowired
    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    // Setter injection for AdminDashboardController
    @Autowired
    public void setAdminDashboardController(AdminDashboardController adminController) {
        this.adminDashboardController = adminController;
    }

    public void loadUsers(UsersView view) {
        this.view = view;
        List<UsersModel> users = usersService.getAllUsers();
        view.populateUsers(users);
    }

    public void back() {
        if (view != null) {
            view.getFrame().dispose(); // Close UsersView window
        }
        // Now safely call openDashboard, because adminDashboardController
        // is injected *after* this bean is created
        adminDashboardController.openDashboard();
    }
}
