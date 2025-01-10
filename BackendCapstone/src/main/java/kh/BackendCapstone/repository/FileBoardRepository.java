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
    
    Page<FileBoard> findAllByUnivAndFileCategory(Univ univ, FileCategory fileCategory, Pageable pageable); // univId를 기준으로 FileBoard 목록을 찾는 메서드
    
    Page<FileBoard> findAllByUniv_UnivNameAndFileCategory(String univName, FileCategory fileCategory, Pageable pageable);
}
