package com.group.silent_santa.view;

import com.group.silent_santa.controller.UsersController;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.model.Colors;
import lombok.Getter;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class UsersView {
    @Getter
    private final JFrame frame;
    @Getter
    private final JTable table;
    @Getter
    private final DefaultTableModel tableModel;
    @Getter
    private final JButton backButton;

    public UsersView(UsersController controller) {
        frame = new JFrame("All Users");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        Color mainColor = Colors.MAIN_COLOR.getColor();
        Color darkColor = Colors.DARK_COLOR.getColor();
        Color lightColor = Colors.LIGHT_COLOR.getColor();

        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(mainColor);

        JLabel titleLabel = new JLabel("Users List", SwingConstants.CENTER);
        titleLabel.setFont(new Font(Font.MONOSPACED, Font.BOLD, 24));
        titleLabel.setForeground(darkColor);
        panel.add(titleLabel, BorderLayout.NORTH);

        // Table setup
        String[] columns = {"First Name", "Last Name", "Email", "Phone", "Role"};
        tableModel = new DefaultTableModel(columns, 0);
        table = new JTable(tableModel);
        table.setFillsViewportHeight(true);
        table.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        table.setRowHeight(25);

        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);

        // Bottom panel with back button
        JPanel bottomPanel = new JPanel();
        bottomPanel.setBackground(mainColor);
        backButton = new JButton("Back");
        backButton.setBackground(lightColor);
        backButton.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 16));
        bottomPanel.add(backButton);
        panel.add(bottomPanel, BorderLayout.SOUTH);
        backButton.addActionListener(e -> controller.back());

        // Load users from controller
        controller.loadUsers(this);

        frame.setContentPane(panel);
        frame.setSize(700, 400);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public void populateUsers(List<UsersModel> users) {
        for (UsersModel user : users) {
            tableModel.addRow(new Object[]{
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole().toString()
            });
        }
    }
}