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
	// 대학 이름과 학과를 기반으로 조회
	List<Univ> findAllByUnivNameAndUnivDept(String univName, String univDept);

	// 단일 조회를 원할 때 사용할 수도 있음
	Optional<Univ> findByUnivNameAndUnivDept(String univName, String univDept);
}
