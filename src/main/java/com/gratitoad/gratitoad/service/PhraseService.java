package com.gratitoad.gratitoad.service;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class PhraseService {

    private final PhraseRepository phraseRepository;

    public PhraseService(PhraseRepository phraseRepository) {
        this.phraseRepository = phraseRepository;
    }

    public Phrase savePhrase(Phrase phrase) {
        return phraseRepository.save(phrase);
    }

    public List<Phrase> getAllPhrases() {
        return phraseRepository.findAll();
    }

    public void deletePhrase(Integer id) {
        if (phraseRepository.existsById(id)) {
            phraseRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Phrase with id " + id + " not found");
        }
    }

    public Optional<Phrase> getPhraseById(Integer id) {
        return phraseRepository.findById(id);
    }
}
