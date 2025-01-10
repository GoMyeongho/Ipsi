package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Univ;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnivRepository extends JpaRepository<Univ, Long> {
	Optional<Univ> findByUnivNameAndUnivDept(String univName, String univDept);
	Optional<Univ> findByUnivId(Long univId);
}
