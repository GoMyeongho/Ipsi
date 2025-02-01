package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {

    List<Review> findByFileBoard(FileBoard fileBoard);

    // FileBoard를 기준으로 댓글 목록을 페이지네이션으로 조회
    Page<Review> findByFileBoard(FileBoard fileBoard, Pageable pageable);
}
