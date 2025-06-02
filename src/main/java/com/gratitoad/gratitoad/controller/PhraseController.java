package com.gratitoad.gratitoad.controller;

import com.gratitoad.gratitoad.entity.Phrase;
import com.gratitoad.gratitoad.repository.PhraseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PhraseController {
    @Autowired
    private PhraseRepository phraseRepository;
    @GetMapping("/phrases")
    public List<Phrase> getAllPhrases() {
        return phraseRepository.findAll();}
}
