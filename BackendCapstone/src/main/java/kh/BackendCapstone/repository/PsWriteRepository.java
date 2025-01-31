package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.PsWrite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PsWriteRepository extends JpaRepository<PsWrite,Long> {
    boolean existsByMemberAndPsName(Member member, String psName);
    Optional<PsWrite> findByMember_MemberIdAndPsWriteId(Long memberId, Long psWriteId);
}
