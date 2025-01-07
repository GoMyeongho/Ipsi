package kh.BackendCapstone.repository;


import kh.BackendCapstone.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {
}
