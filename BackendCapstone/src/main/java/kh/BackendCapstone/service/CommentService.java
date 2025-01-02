package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.request.CommentReqDto;
import kh.BackendCapstone.dto.response.CommentResDto;
import kh.BackendCapstone.entity.Comment;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.TextBoard;
import kh.BackendCapstone.repository.TextBoardRepository;
import kh.BackendCapstone.repository.CommentRepository;
import kh.BackendCapstone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
	private final MemberRepository memberRepository;
	private final CommentRepository commentRepository;
	private final TextBoardRepository textBoardRepository;
	
	// 댓글 등록
	@Transactional
	public boolean commentRegister(CommentReqDto commentReqDto) {
		try {
			Member member = memberRepository.findByEmail(commentReqDto.getEmail())
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			TextBoard textBoard = textBoardRepository.findById(commentReqDto.getBoardId())
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			Comment comment = new Comment();
			comment.setTextBoard(textBoard);
			comment.setMember(member);
			comment.setContent(commentReqDto.getContent());
			commentRepository.save(comment);
			return true;
		} catch (Exception e) {
			log.error("댓글 등록 실패 : {}",e.getMessage());
			return false;
		}
	}
	// 댓글 조회
	
	public List<CommentResDto> findCommentByBoardId(Long textId) {
		try {
			TextBoard textBoard = textBoardRepository.findById(textId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			List<Comment> commentList = commentRepository.findByTextBoard(textBoard);
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for (Comment comment : commentList) commentResDtoList.add(CommentToCommentResDto(comment));
			return commentResDtoList;
		} catch (Exception e) {
			log.error("댓글 조회중 오류 발생");
			return null;
		}
	}
	
	// 댓글 삭제
	
	public boolean deleteComment(Long commentId, Long textId, String email) {
		try {
			Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			TextBoard textBoard = textBoardRepository.findById(textId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new RuntimeException("해당 댓글이 존재하지 않습니다."));
			if (comment.getMember().getMemberId().equals(member.getMemberId())) {
				if (comment.getTextBoard().getTextId().equals(textBoard.getTextId())) {
					commentRepository.delete(comment);
					return true;
				}
				log.error("해당 게시글의 댓글이 아닙니다.");
				return false;
			}
			log.error("해당 댓글의 작성자가 아닙니다.");
			return false;
		} catch (Exception e) {
			log.error("댓글 삭제중 에러 발생 : {}",e.getMessage());
			return false;
		}
	}
	
	
	
	private CommentResDto CommentToCommentResDto(Comment comment) {
		CommentResDto commentResDto = new CommentResDto();
		//BeanUtils.copyProperties(comment, commentResDto);
		commentResDto.setCommentId(comment.getCommentId());
		commentResDto.setContent(comment.getContent());
		commentResDto.setBoardId(comment.getTextBoard().getTextId());
		commentResDto.setEmail(comment.getMember().getEmail());
		commentResDto.setRegDate(comment.getRegDate());
		return commentResDto;
	}
}
