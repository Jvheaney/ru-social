package ca.rumine.backend.RU.Mine.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ca.rumine.backend.RU.Mine.model.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

}
