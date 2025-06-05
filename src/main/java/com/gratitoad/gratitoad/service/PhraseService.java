package com.gratitoad.gratitoad.service;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class PhraseService {

    @Autowired
    private PhraseRepository phraseRepository;

    //hämtar alla fraser
    public List<Phrase> getAllPhrases() {
        return phraseRepository.findAll();
    }

    //Sparar fraser
    public Phrase savePhrase(Phrase phrase) {
        return phraseRepository.save(phrase);
    }

    //uppdaterar fraser
    public Phrase updatePhrase(Integer id, Phrase updatedPhrase) {
        Phrase existing = phraseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Phrase not found"));

        if (updatedPhrase.getPhrase() == null || updatedPhrase.getPhrase().trim().isEmpty()) {
            throw new IllegalArgumentException("Phrase cannot be empty.");
        }

        if (updatedPhrase.getValue() < -3 || updatedPhrase.getValue() > 3) {
            throw new IllegalArgumentException("Value must be between -3 and 3.");
        }

        existing.setPhrase(updatedPhrase.getPhrase());
        existing.setValue(updatedPhrase.getValue());
        return phraseRepository.save(existing);
    }

    //tar bort fraser
    public void deletePhrase(Integer id) {
        if (phraseRepository.existsById(id)) {
            phraseRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Phrase with id " + id + " not found");
        }
    }

    //hämtar en specifik fras via id
    public Phrase getPhraseById(Integer id) {
        return phraseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Phrase with id " + id + " not found"));
    }

    //Sök efter fraser
    public List<Phrase> searchPhrases(String keyword) {
        // Validering
        if (keyword == null) {
            throw new IllegalArgumentException("Search keyword cannot be null");
        }

        if (keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Search keyword cannot be empty");
        }

        if (keyword.length() > 100) {
            throw new IllegalArgumentException("Search keyword cannot be longer than 100 characters");
        }

        return phraseRepository.findByPhraseContainingIgnoreCase(keyword.trim());
    }

    //hämtar positiva fraser
    public List<Phrase> getPositivePhrases() {
        try {
            return phraseRepository.findByValueBetween(1, 3);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve positive phrases", e);
        }
    }

    //hämtar negativa fraser
    public List<Phrase> getNegativePhrases() {
        try {
            return phraseRepository.findByValueBetween(-3, -1);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve negative phrases", e);
        }
    }
}
