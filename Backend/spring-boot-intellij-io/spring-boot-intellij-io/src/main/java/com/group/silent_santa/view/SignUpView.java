package com.group.silent_santa.view;

import com.group.silent_santa.controller.LogInController;
import com.group.silent_santa.controller.SignUpController;
import com.group.silent_santa.model.Colors;
import lombok.Getter;

import javax.swing.*;
import java.awt.*;

public class SignUpView extends Component {
    @Getter
    private final JFrame frame = new JFrame("Create Account");
    @Getter
    private final JTextField firstNameField = new JTextField(20);
    @Getter
    private final JTextField lastNameField = new JTextField(20);
    @Getter
    private final JTextField emailField = new JTextField(20);
    @Getter
    private final JTextField phoneField = new JTextField(20);
    @Getter
    private final JPasswordField passwordField = new JPasswordField(20);
    @Getter
    private final JCheckBox adminCheckBox = new JCheckBox("Register as Admin");

    public SignUpView(SignUpController controller, LogInController logInController) {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        Color mainColor = Colors.MAIN_COLOR.getColor();
        Color darkColor = Colors.DARK_COLOR.getColor();
        Color lightColor = Colors.LIGHT_COLOR.getColor();

        JPanel mainPanel = new JPanel(new BorderLayout(5, 2));
        mainPanel.setBackground(mainColor);

        JPanel upPanel = getjPanel(mainColor, darkColor);
        mainPanel.add(upPanel, BorderLayout.PAGE_START);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(mainColor);
        formPanel.setBorder(BorderFactory.createEmptyBorder(10, 50, 20, 50));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(10, 0, 10, 15);

        addLabelAndField(formPanel, gbc, 0, "First Name:", firstNameField, Color.WHITE);
        addLabelAndField(formPanel, gbc, 1, "Last Name:", lastNameField, Color.WHITE);
        addLabelAndField(formPanel, gbc, 2, "Email:", emailField, Color.WHITE);
        addLabelAndField(formPanel, gbc, 3, "Phone:", phoneField, Color.WHITE);
        addLabelAndField(formPanel, gbc, 4, "Password:", passwordField, Color.WHITE);

        adminCheckBox.setBackground(mainColor);
        adminCheckBox.setForeground(Color.WHITE);
        adminCheckBox.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        gbc.gridx = 1;
        gbc.gridy = 5;
        formPanel.add(adminCheckBox, gbc);

        JButton signUpButton = new JButton("Sign Up");
        signUpButton.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 18));
        signUpButton.setPreferredSize(new Dimension(180, 30));
        signUpButton.setBackground(lightColor);

        signUpButton.addActionListener(e -> {
            try {
                controller.signupButtonClicked(logInController);
            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(null, "❌ Error during registration.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        gbc.gridx = 1;
        gbc.gridy = 6;
        gbc.insets = new Insets(15, 0, 0, 0);
        formPanel.add(signUpButton, gbc);

        mainPanel.add(formPanel, BorderLayout.CENTER);

        frame.setContentPane(mainPanel);
        frame.setPreferredSize(new Dimension(480, 600));
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    private static JPanel getjPanel(Color mainColor, Color darkColor) {
        JPanel upPanel = new JPanel(new GridLayout(2, 1, 1, 2));
        upPanel.setBackground(mainColor);

        JLabel createAccountLabel = new JLabel("Create Account");
        createAccountLabel.setHorizontalAlignment(SwingConstants.CENTER);
        createAccountLabel.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 35));
        createAccountLabel.setForeground(Color.WHITE);
        upPanel.add(createAccountLabel);

        JLabel logoLabel = new JLabel("Silent Santa");
        logoLabel.setHorizontalAlignment(SwingConstants.CENTER);
        logoLabel.setFont(logoLabel.getFont().deriveFont(Font.PLAIN, 30));
        logoLabel.setForeground(darkColor);
        upPanel.add(logoLabel);
        return upPanel;
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
