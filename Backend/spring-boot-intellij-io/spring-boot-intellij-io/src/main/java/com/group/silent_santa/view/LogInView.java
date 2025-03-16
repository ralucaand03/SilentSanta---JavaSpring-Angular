package com.group.silent_santa.view;

import com.group.silent_santa.controller.LogInController;
import com.group.silent_santa.model.Colors;
import lombok.Getter;

import javax.swing.*;
import java.awt.*;

public class LogInView extends Component {
    @Getter
    private final JFrame frame = new JFrame("Log In");
    @Getter
    private final JTextField emailField = new JTextField(20);
    @Getter
    private final JPasswordField passwordField = new JPasswordField(20);

    public LogInView(LogInController controller) {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        Color mainColor = Colors.MAIN_COLOR.getColor();
        Color darkColor = Colors.DARK_COLOR.getColor();
        Color lightColor = Colors.LIGHT_COLOR.getColor();

        JPanel mainPanel = new JPanel(new BorderLayout(5, 2));
        mainPanel.setBackground(mainColor);

        JPanel upPanel = new JPanel(new GridLayout(2, 1, 1, 2));
        upPanel.setBackground(mainColor);

        JLabel loginLabel = new JLabel("Log In");
        loginLabel.setHorizontalAlignment(SwingConstants.CENTER);
        loginLabel.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 35));
        loginLabel.setForeground(Color.WHITE);
        upPanel.add(loginLabel);

        JLabel logoLabel = new JLabel("Silent Santa");
        logoLabel.setHorizontalAlignment(SwingConstants.CENTER);
        logoLabel.setFont(logoLabel.getFont().deriveFont(Font.PLAIN, 30));
        logoLabel.setForeground(darkColor);
        upPanel.add(logoLabel);

        mainPanel.add(upPanel, BorderLayout.PAGE_START);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(mainColor);
        formPanel.setBorder(BorderFactory.createEmptyBorder(10, 50, 20, 50));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(10, 0, 10, 15);

        addLabelAndField(formPanel, gbc, 0, "Email:", emailField, Color.WHITE);
        addLabelAndField(formPanel, gbc, 1, "Password:", passwordField, Color.WHITE);

        JButton loginButton = new JButton("Log In");
        loginButton.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 18));
        loginButton.setPreferredSize(new Dimension(180, 30));
        loginButton.setBackground(lightColor);
        loginButton.addActionListener(e -> controller.loginButtonClicked());

        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.insets = new Insets(15, 0, 0, 0);
        formPanel.add(loginButton, gbc);

        JButton signUpButton = new JButton("Sign Up");
        signUpButton.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 16));
        signUpButton.setPreferredSize(new Dimension(180, 28));
        signUpButton.setBackground(lightColor);
        signUpButton.addActionListener(e -> {
            controller.openSignUpView();
            frame.dispose();
        });

        gbc.gridy = 3;
        gbc.insets = new Insets(5, 0, 0, 0);
        formPanel.add(signUpButton, gbc);

        mainPanel.add(formPanel, BorderLayout.CENTER);

        frame.setContentPane(mainPanel);
        frame.setPreferredSize(new Dimension(480, 450));
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private void addLabelAndField(JPanel panel, GridBagConstraints gbc, int row, String labelText, JComponent field, Color labelColor) {
        JLabel label = new JLabel(labelText);
        label.setFont(new Font(Font.MONOSPACED, Font.BOLD, 18));
        label.setForeground(labelColor);
        gbc.gridx = 0;
        gbc.gridy = row;
        panel.add(label, gbc);

        gbc.gridx = 1;
        panel.add(field, gbc);
    }

    public void setVisible(boolean isVisible) {
        frame.setVisible(isVisible);
    }
}
