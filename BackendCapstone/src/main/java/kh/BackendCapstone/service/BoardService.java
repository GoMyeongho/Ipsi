package kh.BackendCapstone.service;


import com.kh.springJpa241217.dto.request.BoardReqDto;
import com.kh.springJpa241217.dto.response.BoardResDto;
import com.kh.springJpa241217.dto.response.CommentResDto;
import com.kh.springJpa241217.entity.Board;
import com.kh.springJpa241217.entity.Comment;
import com.kh.springJpa241217.entity.Member;
import com.kh.springJpa241217.repository.BoardRepository;
import com.kh.springJpa241217.repository.MemberRepository;
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
public class BoardService {
	private final BoardRepository boardRepository;
	private final MemberRepository memberRepository;
	
	// 게시글 등록
	@Transactional // 일련의 과정중에 오류가 하나라도 생기면 롤백됨
	public boolean saveBoard(BoardReqDto boardReqDto) {
		try {
			Member member = memberRepository.findByEmail(boardReqDto.getEmail())
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			
			Board board = new Board();
			board.setTitle(boardReqDto.getTitle());
			board.setContent(boardReqDto.getContent());
			board.setImgPath(boardReqDto.getImgPath());
			board.setMember(member);
			boardRepository.save(board);
			return true;
		} catch (Exception e) {
			log.error("게시글 등록 실패 : {}",e.getMessage());
			return false;
		}
	}
	// 게시글 상세 조회
	public BoardResDto findByBoardId (Long id) {
		try {
			Board board = boardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			return boardToBoardResDto(board, true);
		} catch (Exception e) {
			log.error("게시글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	// 게시글 전체 조회
	public List<BoardResDto> findBoardAll() {
		try {
			List<Board> boardList = boardRepository.findAll();
			List<BoardResDto> boardResDtoList = new ArrayList<>();
			for(Board board : boardList) boardResDtoList.add(boardToBoardResDto(board, false));
			return boardResDtoList;
		} catch (Exception e) {
			log.error("전체 글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	// 게시글 검색
	public List<BoardResDto> findBoardByTitle(String keyword) {
		try {
			List<Board> boardList = boardRepository.findByTitleContaining(keyword);
			List<BoardResDto> boardResDtoList = new ArrayList<>();
			for(Board board : boardList) {
				boardResDtoList.add(boardToBoardResDto(board, false));
			}
			return boardResDtoList;
		} catch (Exception e) {
			log.error("제목을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	// 게시글의 페이지 수 조회
	public int getBoardPageCount(int size) {
		PageRequest pageRequest = PageRequest.of(0, size);
		return boardRepository.findAll(pageRequest).getTotalPages();
	}
	
	// 게시글 페이징 : 페이지 단위로 나누기
	// 글의 총 개수. 그로인한 페이지 수를 알아야함
	public List<BoardResDto> pagingBoardList(int page, int size) {
		try{
			Pageable pageable = PageRequest.of(page, size);
			List<Board> boardList = boardRepository.findAll(pageable).getContent();
			List<BoardResDto> boardResDtoList = new ArrayList<>();
			for(Board board : boardList) boardResDtoList.add(boardToBoardResDto(board, false));
			return boardResDtoList;
		} catch (Exception e) {
			log.error("페이지를 불러오는 중에 오류 : {}",e.getMessage());
			return null;
		}
	}
	
	// 게시글 수정
	@Transactional
	public boolean updateBoard(BoardReqDto boardReqDto, Long id) {
		try{
			Board board = boardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			if(boardReqDto.getEmail().equals(board.getMember().getEmail())) {
				board.setTitle(boardReqDto.getTitle());
				board.setContent(boardReqDto.getContent());
				board.setImgPath(boardReqDto.getImgPath());
				boardRepository.save(board);
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
			Board board = boardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			if(email.equals(board.getMember().getEmail())) {
			boardRepository.delete(board);
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
			Page<Board> page = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageRequest);
			return page.getTotalPages();
		} catch (Exception e) {
			log.error("제목과 내용으로 게시글 페이지 조회 중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	public List<BoardResDto> findBoardByTitleOrContent(String keyword, int size, int page) {
		try{
			Pageable pageable = PageRequest.of(page, size);
			List<Board> boardList = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable).getContent();
			List<BoardResDto> boardResDtoList = new ArrayList<>();
			for (Board board : boardList) boardResDtoList.add(boardToBoardResDto(board, false));
			return boardResDtoList;
		} catch (Exception e) {
			log.error("제목과 내용으로 게시글 조회중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	// 댓글 목록 조회
	public List<CommentResDto> findCommentByBoardId(Long boardId) {
		try {
			Board board = boardRepository.findById(boardId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			List<Comment> commentList = board.getComments();
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for(Comment comment : commentList) {
				CommentResDto commentResDto = new CommentResDto();
				commentResDto.setBoardId(comment.getBoard().getId());
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
	}
	
	
	// board 객체를 BoardResDto로 바꿔주는 메서드
	private BoardResDto boardToBoardResDto(Board board, boolean isComment) {
		BoardResDto boardResDto = new BoardResDto();
		boardResDto.setBoardId(board.getId());
		boardResDto.setTitle(board.getTitle());
		boardResDto.setContent(board.getContent());
		boardResDto.setImgPath(board.getImgPath());
		boardResDto.setRegDate(board.getRegDate());
		boardResDto.setEmail(board.getMember().getEmail());
		if(isComment) {
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for(Comment comment : board.getComments()){
				CommentResDto commentResDto = new CommentResDto();
				commentResDto.setBoardId(comment.getBoard().getId());
				commentResDto.setCommentId(comment.getCommentId());
				commentResDto.setContent(comment.getContent());
				commentResDto.setRegDate(comment.getRegDate());
				commentResDto.setEmail(comment.getMember().getEmail());
				commentResDtoList.add(commentResDto);
			}
			boardResDto.setComments(commentResDtoList);
		}
		return boardResDto;
	}
}
