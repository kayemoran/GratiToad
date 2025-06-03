package com.gratitoad.gratitoad.service;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhraseService {

    @Autowired
    private PhraseRepository phraseRepository;

    public List<Phrase> getAllPhrases() {
        return phraseRepository.findAll();
    }

    public Phrase savePhrase(Phrase phrase) {
        return phraseRepository.save(phrase);
    }

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
}
