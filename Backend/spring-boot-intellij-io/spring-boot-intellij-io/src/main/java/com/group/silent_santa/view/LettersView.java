package com.group.silent_santa.view;

import com.group.silent_santa.controller.LettersController;
import com.group.silent_santa.model.Colors;
import com.group.silent_santa.model.LettersModel;
import lombok.Getter;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class LettersView {

    @Getter
    private final JFrame frame;
    @Getter
    private final JTable table;
    @Getter
    private final DefaultTableModel tableModel;
    @Getter
    private final JButton backButton;
    @Getter
    private final JButton addLetterButton;
    @Getter
    private final List<LettersModel> letters = new ArrayList<>();

    public LettersView(LettersController controller) {
        frame = new JFrame("Letters Overview");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        Color mainColor = Colors.MAIN_COLOR.getColor();
        Color darkColor = Colors.DARK_COLOR.getColor();
        Color lightColor = Colors.LIGHT_COLOR.getColor();

        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(mainColor);

        JLabel titleLabel = new JLabel("Letters List", SwingConstants.CENTER);
        titleLabel.setFont(new Font(Font.MONOSPACED, Font.BOLD, 24));
        titleLabel.setForeground(darkColor);
        panel.add(titleLabel, BorderLayout.NORTH);

        // Table setup
        String[] columns = {"Child Name", "Created At", "Posted By", "Status", "View"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return column == 4; // Only "View" button column editable
            }
        };
        table = new JTable(tableModel);
        table.setRowHeight(30);

        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);

        // Bottom Button Panel
        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        bottomPanel.setBackground(mainColor);

        addLetterButton = new JButton("Add Letter");
        addLetterButton.setBackground(lightColor);
        addLetterButton.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 16));
        bottomPanel.add(addLetterButton);

        backButton = new JButton("Back");
        backButton.setBackground(lightColor);
        backButton.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 16));
        bottomPanel.add(backButton);

        panel.add(bottomPanel, BorderLayout.SOUTH);

        controller.loadLetters(this);

        frame.setContentPane(panel);
        frame.setSize(800, 400);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        // Set cell renderer and editor for "View" button column
        table.getColumn("View").setCellRenderer(new ButtonRenderer());
        table.getColumn("View").setCellEditor(new ButtonEditor(new JCheckBox(),controller, this));

        // Button actions
        backButton.addActionListener(e -> controller.back());
        addLetterButton.addActionListener(e -> controller.addLetter(this));
    }
    public void populateLetters(List<LettersModel> letterList) {
        if (letterList == null || letterList.isEmpty()) {
            //JOptionPane.showMessageDialog(null, "No letters available.");
            System.out.println("No letters");
        } else {
            letters.clear(); // Clear existing letters list
            tableModel.setRowCount(0); // Clear existing rows from the table model
            for (LettersModel letter : letterList) {
                letters.add(letter); // Add new letter data to the list

                tableModel.addRow(new Object[]{
                        letter.getChildName(),
                        letter.getCreatedAt(),
                        letter.getPostedBy().getFirstName() + " " + letter.getPostedBy().getLastName(),
                        letter.getStatus().name(),
                        "View"
                });
            }
        }
    }



    public LettersModel getLetterAt(int rowIndex) {
        if (rowIndex >= 0 && rowIndex < letters.size()) {
            return letters.get(rowIndex);
        }
        return null;
    }
}
// Button Renderer and Editor
class ButtonRenderer extends JButton implements javax.swing.table.TableCellRenderer {
    public ButtonRenderer() {
        setOpaque(true);
    }

    public Component getTableCellRendererComponent(JTable table, Object value,
                                                   boolean isSelected, boolean hasFocus,
                                                   int row, int column) {
        setText(value == null ? "" : value.toString());
        return this;
    }
}
class ButtonEditor extends DefaultCellEditor {
    private final JButton button;
    private String label;
    private boolean clicked;
    private final LettersController controller;
    private final LettersView view;
    private int selectedRow;

    public ButtonEditor(JCheckBox checkBox, LettersController controller, LettersView view) {
        super(checkBox);
        this.controller = controller;
        this.view = view;
        this.button = new JButton();
        button.setOpaque(true);

        // Ensure the button works by stopping editing and triggering the action
        button.addActionListener(e -> fireEditingStopped());
    }

    @Override
    public Component getTableCellEditorComponent(JTable table, Object value, boolean isSelected, int row, int column) {
        // Validate that the row index is within the bounds of the table
        if (row < 0 || row >= table.getRowCount()) {
            return button;  // Return the button without any further interaction
        }

        label = (value == null) ? "" : value.toString();
        button.setText(label);
        clicked = true;
        selectedRow = row;  // Store the selected row index
        return button;
    }

    @Override
    public Object getCellEditorValue() {
        if (clicked) {
            // Only proceed if the row index is valid
            if (selectedRow >= 0 && selectedRow < view.getLetters().size()) {
                controller.onViewLetter(selectedRow);
            }
        }
        clicked = false;
        return label;
    }

    @Override
    public boolean stopCellEditing() {
        clicked = false;
        return super.stopCellEditing();
    }
}
