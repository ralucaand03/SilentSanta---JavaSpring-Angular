package com.group.silent_santa.view;

import com.group.silent_santa.controller.AdminDashboardController;
import com.group.silent_santa.model.Colors;
import lombok.Getter;

import javax.swing.*;
import java.awt.*;

public class AdminDashboardView {

    @Getter
    private final JFrame frame;
    @Getter
    private final JButton viewUsersButton;
    @Getter
    private final JButton viewLettersButton;
    @Getter
    private final JButton viewRequestsButton;

    public AdminDashboardView(AdminDashboardController controller) {
        frame = new JFrame("Admin Dashboard");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        Color mainColor = Colors.MAIN_COLOR.getColor();
        Color darkColor = Colors.DARK_COLOR.getColor();
        Color lightColor = Colors.LIGHT_COLOR.getColor();

        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBackground(mainColor);

        // Title Panel
        JPanel titlePanel = new JPanel(new GridLayout(2, 1));
        titlePanel.setBackground(mainColor);

        JLabel adminLabel = new JLabel("Admin Dashboard", SwingConstants.CENTER);
        adminLabel.setFont(new Font(Font.MONOSPACED, Font.BOLD, 30));
        adminLabel.setForeground(darkColor);
        titlePanel.add(adminLabel);

        JLabel titleLabel = new JLabel("Silent Santa", SwingConstants.CENTER);
        titleLabel.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 26));
        titleLabel.setForeground(darkColor);
        titlePanel.add(titleLabel);

        mainPanel.add(titlePanel, BorderLayout.NORTH);

        // Button Panel
        JPanel buttonPanel = new JPanel(new GridLayout(4, 1, 10, 10));
        buttonPanel.setBackground(mainColor);
        buttonPanel.setBorder(BorderFactory.createEmptyBorder(20, 50, 20, 50));

        JLabel funcLabel = new JLabel("Functionalities", SwingConstants.CENTER);
        funcLabel.setFont(new Font(Font.MONOSPACED, Font.BOLD, 20));
        funcLabel.setForeground(Color.WHITE);
        buttonPanel.add(funcLabel);

        viewUsersButton = new JButton("View Users");
        viewLettersButton = new JButton("View Letters");
        viewRequestsButton = new JButton("View Requests");

        for (JButton button : new JButton[]{viewUsersButton, viewLettersButton, viewRequestsButton}) {
            button.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 18));
            button.setBackground(lightColor);
            button.setFocusPainted(false);
            buttonPanel.add(button);
        }

        mainPanel.add(buttonPanel, BorderLayout.CENTER);

        frame.setContentPane(mainPanel);
        frame.setSize(500, 400);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        // 🔗 Add actions
        viewUsersButton.addActionListener(e -> controller.onViewUsers(this));
        viewLettersButton.addActionListener(e -> controller.onViewLetters(this));
        viewRequestsButton.addActionListener(e -> controller.onViewRequests(this));
    }
}
