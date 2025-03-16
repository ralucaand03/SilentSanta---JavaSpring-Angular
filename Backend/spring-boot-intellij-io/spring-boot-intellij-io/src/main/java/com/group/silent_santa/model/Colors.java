package com.group.silent_santa.model;

import java.awt.*;

public enum Colors {
    MAIN_COLOR(new Color(33, 37, 41)),      // dark gray background
    DARK_COLOR(new Color(220, 53, 69)),     // red accent
    LIGHT_COLOR(new Color(108, 154, 139));    // green accent

    private final Color color;

    Colors(Color color) {
        this.color = color;
    }

    public Color getColor() {
        return color;
    }
}

