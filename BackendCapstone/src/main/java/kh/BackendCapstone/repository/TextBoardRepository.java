package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.TextBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TextBoardRepository extends JpaRepository<TextBoard, Long> {
	List<TextBoard> findByTitleContaining(String keyword);
	Page<TextBoard> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
	
}
