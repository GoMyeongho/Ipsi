package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.request.TextBoardReqDto;
import kh.BackendCapstone.dto.response.TextBoardResDto;
import kh.BackendCapstone.dto.response.CommentResDto;
import kh.BackendCapstone.entity.TextBoard;
import kh.BackendCapstone.entity.Comment;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.repository.TextBoardRepository;
import kh.BackendCapstone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TextBoardService {
	private final TextBoardRepository textBoardRepository;
	private final MemberRepository memberRepository;
	
	// 게시글 등록
	@Transactional // 일련의 과정중에 오류가 하나라도 생기면 롤백됨
	public boolean saveBoard(TextBoardReqDto textBoardReqDto) {
		try {
			Member member = memberRepository.findByEmail(textBoardReqDto.getEmail())
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));

			TextBoard textBoard = new TextBoard();
			textBoard.setTitle(textBoardReqDto.getTitle());
			textBoard.setContent(textBoardReqDto.getContent());
			textBoard.setMember(member);
			textBoardRepository.save(textBoard);
			return true;
		} catch (Exception e) {
			log.error("게시글 등록 실패 : {}",e.getMessage());
			return false;
		}
	}
	// 게시글 상세 조회
	public TextBoardResDto findByBoardId (Long id) {
		try {
			TextBoard textBoard = textBoardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			return boardToBoardResDto(textBoard, true);
		} catch (Exception e) {
			log.error("게시글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	// 게시글 전체 조회
	public List<TextBoardResDto> findBoardAll() {
		try {
			List<TextBoard> textBoardList = textBoardRepository.findAll();
			List<TextBoardResDto> textBoardResDtoList = new ArrayList<>();
			for(TextBoard textBoard : textBoardList) textBoardResDtoList.add(boardToBoardResDto(textBoard, false));
			return textBoardResDtoList;
		} catch (Exception e) {
			log.error("전체 글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	// 게시글 검색
	public List<TextBoardResDto> findBoardByTitle(String keyword) {
		try {
			List<TextBoard> textBoardList = textBoardRepository.findByTitleContaining(keyword);
			List<TextBoardResDto> textBoardResDtoList = new ArrayList<>();
			for(TextBoard textBoard : textBoardList) {
				textBoardResDtoList.add(boardToBoardResDto(textBoard, false));
			}
			return textBoardResDtoList;
		} catch (Exception e) {
			log.error("제목을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	// 게시글의 페이지 수 조회
	public int getBoardPageCount(int size) {
		PageRequest pageRequest = PageRequest.of(0, size);
		return textBoardRepository.findAll(pageRequest).getTotalPages();
	}
	
	// 게시글 페이징 : 페이지 단위로 나누기
	// 글의 총 개수. 그로인한 페이지 수를 알아야함
	public List<TextBoardResDto> pagingBoardList(int page, int size) {
		try{
			Pageable pageable = PageRequest.of(page, size);
			List<TextBoard> textBoardList = textBoardRepository.findAll(pageable).getContent();
			List<TextBoardResDto> textBoardResDtoList = new ArrayList<>();
			for(TextBoard textBoard : textBoardList) textBoardResDtoList.add(boardToBoardResDto(textBoard, false));
			return textBoardResDtoList;
		} catch (Exception e) {
			log.error("페이지를 불러오는 중에 오류 : {}",e.getMessage());
			return null;
		}
	}
	
	// 게시글 수정
	@Transactional
	public boolean updateBoard(TextBoardReqDto textBoardReqDto, Long textId) {
		try{
			TextBoard textBoard = textBoardRepository.findById(textId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			if(textBoardReqDto.getEmail().equals(textBoard.getMember().getEmail())) {
				textBoard.setTitle(textBoardReqDto.getTitle());
				textBoard.setContent(textBoardReqDto.getContent());
				textBoardRepository.save(textBoard);
				return true;
			}
			log.error("수정하려는 글의 작성자가 아닙니다.");
			return false;
		} catch (Exception e) {
			log.error("게시글 수정중 오류가 생겼습니다 : {}",e.getMessage());
			return false;
		}
	}
	
	// 게시글 삭제
	public boolean deleteBoard(String email, Long id) {
		try {
			TextBoard board = textBoardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			if(email.equals(board.getMember().getEmail())) {
			textBoardRepository.delete(board);
			return true;
			}
			log.error("삭제하려는 글의 작성자가 아닙니다.");
			return false;
		} catch (Exception e) {
			log.error("게시글 삭제중 오류가 생겼습니다 : {}",e.getMessage());
			return false;
		}
	}
	// 게시글 검색 (제목과 내용)
	public int findBoardPageByTitleOrContent(String keyword , int size) {
		try{
			PageRequest pageRequest = PageRequest.of(0, size);
			Page<TextBoard> page = textBoardRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageRequest);
			return page.getTotalPages();
		} catch (Exception e) {
			log.error("제목과 내용으로 게시글 페이지 조회 중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	public List<TextBoardResDto> findBoardByTitleOrContent(String keyword, int size, int page) {
		try{
			Pageable pageable = PageRequest.of(page, size);
			List<TextBoard> boardList = textBoardRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable).getContent();
			List<TextBoardResDto> textBoardResDtoList = new ArrayList<>();
			for (TextBoard board : boardList) textBoardResDtoList.add(boardToBoardResDto(board, false));
			return textBoardResDtoList;
		} catch (Exception e) {
			log.error("제목과 내용으로 게시글 조회중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
/*	// 댓글 목록 조회
	public List<CommentResDto> findCommentByBoardId(Long textId) {
		try {
			TextBoard textBoard = textBoardRepository.findById(textId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			List<Comment> commentList = textBoard.getComments();
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for(Comment comment : commentList) {
				CommentResDto commentResDto = new CommentResDto();
				commentResDto.setBoardId(comment.getTextBoard().getTextId());
				commentResDto.setCommentId(comment.getCommentId());
				commentResDto.setContent(comment.getContent());
				commentResDto.setRegDate(comment.getRegDate());
				commentResDto.setEmail(comment.getMember().getEmail());
				commentResDtoList.add(commentResDto);
			}
			return commentResDtoList;
		} catch (Exception e) {
			log.error("게시글에 대한 댓글 조회 실패 : {}", e.getMessage());
			return null;
		}
	}*/
	
	
	// board 객체를 BoardResDto로 바꿔주는 메서드
	private TextBoardResDto boardToBoardResDto(TextBoard textBoard, boolean isComment) {
		TextBoardResDto textBoardResDto = new TextBoardResDto();
		textBoardResDto.setBoardId(textBoard.getTextId());
		textBoardResDto.setTitle(textBoard.getTitle());
		textBoardResDto.setContent(textBoard.getContent());
		textBoardResDto.setRegDate(textBoard.getRegDate());
		textBoardResDto.setEmail(textBoard.getMember().getEmail());
		if(isComment) {
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for(Comment comment : textBoard.getComments()){
				CommentResDto commentResDto = new CommentResDto();
				commentResDto.setBoardId(comment.getTextId());
//				commentResDto.setBoardId(comment.getTextBoard().getTextId());
				commentResDto.setCommentId(comment.getCommentId());
				commentResDto.setContent(comment.getContent());
				commentResDto.setRegDate(comment.getRegDate());
				commentResDto.setEmail(comment.getMember().getEmail());
				commentResDtoList.add(commentResDto);
			}
			textBoardResDto.setComments(commentResDtoList);
		}
		return textBoardResDto;
	}
}
