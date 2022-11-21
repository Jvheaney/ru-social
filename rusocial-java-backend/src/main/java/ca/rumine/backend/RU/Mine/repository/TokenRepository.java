package ca.rumine.backend.RU.Mine.repository;


import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long>{
	
	@Transactional
	@Modifying
	@Query("UPDATE Token SET blacklisted_at=CURRENT_TIMESTAMP WHERE blacklisted_at is NULL AND userid=:userid") 
    void blackListAllTokens(@Param("userid") String userid);
	
	@Query("SELECT t FROM Token t WHERE reference = :reference AND (blacklisted_at is NULL or blacklisted_at >= :allowance)") 
    Token getExpiryTime(@Param("reference") String reference, @Param("allowance") Date allowance);
}
