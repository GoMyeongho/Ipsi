package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.TextBoard;
import kh.BackendCapstone.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	Page<Comment> findByTextBoardAndActive(TextBoard textBoard, Active active, Pageable pageable);
	List<Comment> findByMember(Member member);
	Optional<Comment> findByCommentId(Long id);
}
