package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    boolean existsByRefreshToken(String refreshToken);
    boolean  existsByMember(Member member);
    Optional<RefreshToken> findByMember(Member member);

    void deleteByMember(Member member);

}