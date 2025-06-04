package com.gratitoad.gratitoad.repository;

import com.gratitoad.gratitoad.entity.Phrase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhraseRepository extends JpaRepository<Phrase, Integer>{
    // Sök efter fraser som innehåller keyword (case-insensitive)
    List<Phrase> findByPhraseContainingIgnoreCase(String keyword);

    // Filtrera efter värdeintervall
    List<Phrase> findByValueBetween(int minValue, int maxValue);
}
