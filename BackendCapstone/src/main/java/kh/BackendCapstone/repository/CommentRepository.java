package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.TextBoard;
import kh.BackendCapstone.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	List<Comment> findByTextBoard(TextBoard textBoard);
}
