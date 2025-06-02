package com.gratitoad.gratitoad.controller;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import com.gratitoad.gratitoad.service.PhraseService;
import org.springframework.beans.factory.annotation.Autowired;
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


}
