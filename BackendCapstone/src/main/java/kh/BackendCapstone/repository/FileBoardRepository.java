package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Univ;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileBoardRepository extends JpaRepository<FileBoard, Long> {
    Page<FileBoard> findAllByFileCategory(FileCategory fileCategory, Pageable pageable);

    Page<FileBoard> findAllByUnivInAndFileCategory(List<Univ> univList, FileCategory fileCategory, Pageable pageable);

    Page<FileBoard> findAllByUniv_UnivNameAndFileCategory(String univName, FileCategory fileCategory, Pageable pageable);

    // 회원 ID와 파일 카테고리로 필터링된 파일 목록을 조회하는 메서드
    List<FileBoard> findByMember_MemberIdAndFileCategory(Long memberId, FileCategory fileCategory);

    List<FileBoard> findAllByFileCategory(FileCategory fileCategory);
}
