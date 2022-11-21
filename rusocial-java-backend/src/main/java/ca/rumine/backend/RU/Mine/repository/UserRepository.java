package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ca.rumine.backend.RU.Mine.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	
	@Query("SELECT u FROM User u where email = :email") 
    User findByEmail(@Param("email") String email);
	
	@Query("SELECT u FROM User u where userid = :userid") 
    User findByUserid(@Param("userid") String userid);
}
