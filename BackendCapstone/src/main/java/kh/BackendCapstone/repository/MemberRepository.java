package kh.BackendCapstone.repository;


import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);


	Optional<Member> findByEmail(String email);

	boolean existsByNickName(String nickName);

	// memberId로 회원 정보 조회
	Optional<Member> findById(Long id);

	Optional<Member> findByAuthority(Authority authority);
}