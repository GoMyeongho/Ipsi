package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Univ;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UnivRepository extends JpaRepository<Univ, Long> {
	Optional<Univ> findById(Long univId);
}
