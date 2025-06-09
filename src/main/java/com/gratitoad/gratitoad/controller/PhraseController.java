package com.gratitoad.gratitoad.controller;

import com.gratitoad.gratitoad.entity.Phrase;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.EntityNotFoundException;
import com.gratitoad.gratitoad.service.PhraseService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PhraseController {
    @Autowired
    private PhraseService phraseService;

    //hämta alla fraser
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

    //sparar fras
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

    // raderar fras
    @DeleteMapping("/phrases/{id}")
    public ResponseEntity<String> deletePhrase(@PathVariable Integer id) {
        try {
            phraseService.deletePhrase(id);
            return ResponseEntity.ok("Phrase deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body("Phrase with id " + id + " not found");
        }
    }

    //uppdaterar fras
    @PutMapping("/phrases/{id}")
    public ResponseEntity<?> updatePhrase(@PathVariable Integer id, @RequestBody Phrase phrase) { //@Valid??? Med @Valid får Spring automatiskt valideringsfel, läggs till sen.
        try {
            Phrase updated = phraseService.updatePhrase(id, phrase);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    // Sök efter fraser som innehåller text
    @GetMapping("/phrases/search")
    public ResponseEntity<?> searchPhrases(@RequestParam String keyword) {
        try {
            List<Phrase> phrases = phraseService.searchPhrases(keyword);

            if (phrases.isEmpty()) {
                return ResponseEntity.ok().body("No phrases found containing: " + keyword);
            }

            return ResponseEntity.ok(phrases);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid search: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error while searching phrases");
        }
    }

    // Hämtar positiva fraser
    @GetMapping("/phrases/positive")
    public ResponseEntity<?> getPositivePhrases() {
        try {
            List<Phrase> phrases = phraseService.getPositivePhrases();

            if (phrases.isEmpty()) {
                return ResponseEntity.ok().body("No positive phrases found");
            }

            return ResponseEntity.ok(phrases);

        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error retrieving positive phrases: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error while retrieving positive phrases");
        }
    }

    // Hämtar negativa fraser
    @GetMapping("/phrases/negative")
    public ResponseEntity<?> getNegativePhrases() {
        try {
            List<Phrase> phrases = phraseService.getNegativePhrases();

            if (phrases.isEmpty()) {
                return ResponseEntity.ok().body("No negative phrases found");
            }

            return ResponseEntity.ok(phrases);

        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error retrieving negative phrases: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error while retrieving negative phrases");
        }
    }

    //Hämtar en specifik fras via id
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