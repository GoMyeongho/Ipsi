package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
	Optional<Permission> findByPermissionId(Long id);
	List<Permission> findAllByActive(Active active);
}
