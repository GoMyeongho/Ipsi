package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Payments;
import kh.BackendCapstone.entity.Univ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnivRepository extends JpaRepository<Univ, Long> {
}
