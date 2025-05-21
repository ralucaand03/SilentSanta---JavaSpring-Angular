package com.group.silent_santa.model;
import com.group.silent_santa.model.LettersModel;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "letters")
public class LetterListWrapper {
    private List<LettersModel> letters;

    @XmlElement(name = "letter")
    public List<LettersModel> getLetters() {
        return letters;
    }

    public void setLetters(List<LettersModel> letters) {
        this.letters = letters;
    }
}
