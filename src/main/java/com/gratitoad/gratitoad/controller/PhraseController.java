package com.gratitoad.gratitoad.controller;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import com.gratitoad.gratitoad.service.PhraseService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class PhraseController {
    @Autowired
    private PhraseService phraseService;

    @GetMapping("/phrases")
    public List<Phrase> getAllPhrases() {
        return phraseService.getAllPhrases();
    }

    @PostMapping("/phrases")
    public Phrase savePhrase(@RequestBody Phrase phrase) {
        return phraseService.savePhrase(phrase);
    }

    @DeleteMapping("/phrases/{id}")
    public ResponseEntity<String> deletePhrase(@PathVariable Integer id) {
        try {
            phraseService.deletePhrase(id);
            return ResponseEntity.ok("Phrase deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body("Phrase with id " + id + " not found");
        }
    }

    @GetMapping("/phrases/{id}")
    public ResponseEntity<Phrase> getPhraseById(@PathVariable Integer id) {
        try {
            Phrase phrase = phraseService.getPhraseById(id);
            return ResponseEntity.ok(phrase);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }


}
