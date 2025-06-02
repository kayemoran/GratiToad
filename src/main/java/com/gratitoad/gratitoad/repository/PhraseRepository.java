package com.gratitoad.gratitoad.repository;

import com.gratitoad.gratitoad.entity.Phrase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PhraseRepository extends JpaRepository<Phrase, Integer>{
}
