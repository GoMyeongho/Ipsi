package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.PsWrite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PsWriteRepository extends JpaRepository<PsWrite,Long> {

    boolean existsByMemberAndPsName(Member member, String psName);

    Optional<PsWrite> findByMember_MemberIdAndPsWriteId(Long memberId, Long psWriteId);

    Optional<PsWrite> findByPsWriteId(Long psWriteId);

    // 로그인한 회원이 작성한 자기소개서 목록 조회
    @Query("SELECT cr FROM PsWrite cr WHERE cr.member.memberId = :memberId")
    List<PsWrite> findPsWriteByMemberId(@Param("memberId") Long memberId);
}
