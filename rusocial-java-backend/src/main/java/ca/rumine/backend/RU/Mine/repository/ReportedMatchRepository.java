package ca.rumine.backend.RU.Mine.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ca.rumine.backend.RU.Mine.model.ReportedMatch;

@Repository
public interface ReportedMatchRepository extends JpaRepository<ReportedMatch, Long> {

}
