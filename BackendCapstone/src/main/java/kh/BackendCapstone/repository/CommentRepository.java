package kh.BackendCapstone.repository;

import com.kh.springJpa241217.entity.Board;
import com.kh.springJpa241217.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	public List<Comment> findByBoard(Board board);
}
