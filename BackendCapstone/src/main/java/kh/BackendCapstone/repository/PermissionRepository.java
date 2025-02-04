package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {


	Optional<Permission> findByPermissionId(Long id);

	List<Permission> findAllByActive(Active active);


	public List<Permission> findByMember(Member member);
}