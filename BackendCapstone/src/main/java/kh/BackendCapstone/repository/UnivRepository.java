package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Univ;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnivRepository extends JpaRepository<Univ, Long> {
    @Query("SELECT u FROM Univ u WHERE (:univName IS NULL OR :univName = '' OR u.univName LIKE %:univName%) " +
            "AND (:univDept IS NULL OR :univDept = '' OR u.univDept LIKE %:univDept%)")
    Page<Univ> findByFilters(@Param("univName") String univName, @Param("univDept") String univDept, Pageable pageable);
}
