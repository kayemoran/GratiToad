package com.gratitoad.gratitoad.controller;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.EntityNotFoundException;
import com.gratitoad.gratitoad.service.PhraseService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class PhraseController {
    @Autowired
    private PhraseService phraseService;

    
    @GetMapping("/phrases")
    public ResponseEntity<?> getAllPhrases() {
        try {
            List<Phrase> phrases = phraseService.getAllPhrases();
            if (phrases.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Currently no phrases.");
            }
            return ResponseEntity.ok(phrases);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to get phrases." + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error getting the phrases." + e.getMessage());
        }
    }

    @PostMapping("/phrases")
    public ResponseEntity<String> savePhrase(@RequestBody Phrase phrase) {
        try {
            phraseService.savePhrase(phrase);
            return ResponseEntity.status(HttpStatus.CREATED).body("Phrase saved successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Phrase failed to be saved." + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error:" + e.getMessage());
            //Continue using this type of status format
        }

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
      @PutMapping("/phrases/{id}")
    public ResponseEntity<?> updatePhrase(@PathVariable Integer id, @RequestBody Phrase phrase) { //@Valid???Med @Valid får Spring automatiskt valideringsfel, läggs till sen.
        try {
            Phrase updated = phraseService.updatePhrase(id, phrase);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
