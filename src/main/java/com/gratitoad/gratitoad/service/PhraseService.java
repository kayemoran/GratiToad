package com.gratitoad.gratitoad.service;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    }
