package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Univ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileBoardRepository extends JpaRepository<FileBoard, Long> {
    List<FileBoard> findByUniv(Univ univ); // univId를 기준으로 FileBoard 목록을 찾는 메서드
}
