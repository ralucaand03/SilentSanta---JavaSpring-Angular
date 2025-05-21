package com.group.silent_santa.controller;

import com.group.silent_santa.model.LetterListWrapper;
import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.service.LettersService;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class XMLExportController {

    private final LettersService lettersService;
    private final LettersRepository lettersRepository;

    @Autowired
    public XMLExportController(LettersService lettersService, LettersRepository lettersRepository) {
        this.lettersService = lettersService;
        this.lettersRepository = lettersRepository;
    }

    @GetMapping("/letters/export/xml")
    public ResponseEntity<String> exportAllLettersToXml() {
        try {
            // Get all letters from the repository
            List<LettersModel> letters = lettersRepository.findAll();

            // Create the wrapper and set the letters
            LetterListWrapper wrapper = new LetterListWrapper();
            wrapper.setLetters(letters);

            // Use JAXB to marshal the wrapper to XML
            JAXBContext context = JAXBContext.newInstance(LetterListWrapper.class);
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

            StringWriter sw = new StringWriter();
            marshaller.marshal(wrapper, sw);

            // Set up response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_XML);
            headers.setContentDispositionFormData("attachment", "all-letters.xml");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(sw.toString());

        } catch (JAXBException e) {
            return ResponseEntity.internalServerError().body("<error>Error marshalling XML: " + e.getMessage() + "</error>");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("<error>" + e.getMessage() + "</error>");
        }
    }

    @GetMapping("/letters/export/xml/{id}")
    public ResponseEntity<String> exportLetterToXml(@PathVariable UUID id) {
        try {
            // Get the specific letter from the repository
            Optional<LettersModel> letterOpt = lettersRepository.findById(id);

            if (letterOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            LettersModel letter = letterOpt.get();

            // Create a list with just this letter
            List<LettersModel> letters = new ArrayList<>();
            letters.add(letter);

            // Create the wrapper and set the letter
            LetterListWrapper wrapper = new LetterListWrapper();
            wrapper.setLetters(letters);

            // Use JAXB to marshal the wrapper to XML
            JAXBContext context = JAXBContext.newInstance(LetterListWrapper.class);
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

            StringWriter sw = new StringWriter();
            marshaller.marshal(wrapper, sw);

            // Set up response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_XML);
            headers.setContentDispositionFormData("attachment", "letter-" + id + ".xml");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(sw.toString());

        } catch (JAXBException e) {
            return ResponseEntity.internalServerError().body("<error>Error marshalling XML: " + e.getMessage() + "</error>");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("<error>" + e.getMessage() + "</error>");
        }
    }
}
