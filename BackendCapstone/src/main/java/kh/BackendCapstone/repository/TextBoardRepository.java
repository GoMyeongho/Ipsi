package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.TextCategory;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.TextBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface TextBoardRepository extends JpaRepository<TextBoard, Long> {
	Page<TextBoard> findByActiveAndTextCategory(Active active, TextCategory textCategory, Pageable pageable);
	Page<TextBoard> findByActiveAndTextCategoryAndTitleContainingOrContentContaining(Active active, TextCategory category, String title, String content, Pageable pageable);
	Page<TextBoard> findByActiveAndTextCategoryAndTitleContaining(Active active, TextCategory textCategory, String title, Pageable pageable);
	Page<TextBoard> findByActiveAndTextCategoryAndMember(Active active, TextCategory textCategory, Member member, Pageable pageable);
	Page<TextBoard> findByActiveAndTextCategoryAndMember_NickNameContaining(Active active, TextCategory textCategory, String nickName, Pageable pageable);
	Optional<TextBoard> findByTextId(Long id);
}
