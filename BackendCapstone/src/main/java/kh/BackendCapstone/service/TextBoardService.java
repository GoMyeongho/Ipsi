package kh.BackendCapstone.service;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.TextCategory;
import kh.BackendCapstone.dto.request.CommentReqDto;
import kh.BackendCapstone.dto.request.TextBoardReqDto;
import kh.BackendCapstone.dto.response.TextBoardListResDto;
import kh.BackendCapstone.dto.response.TextBoardResDto;
import kh.BackendCapstone.dto.response.CommentResDto;
import kh.BackendCapstone.entity.TextBoard;
import kh.BackendCapstone.entity.Comment;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.repository.CommentRepository;
import kh.BackendCapstone.repository.TextBoardRepository;
import kh.BackendCapstone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
	private final MemberService memberService;
	private final CommentRepository commentRepository;
	
	// 게시글 등록
	@Transactional // 일련의 과정중에 오류가 하나라도 생기면 롤백됨
	public boolean saveBoard(TextBoardReqDto textBoardReqDto, String token) {
		try {
			Member member = memberService.convertTokenToEntity(token);
			TextBoard textBoard = textBoardRepository.findByTextId(textBoardReqDto.getTextId())
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			textBoard.setTitle(textBoardReqDto.getTitle());
			textBoard.setContent(textBoardReqDto.getContent());
			textBoard.setMember(member);
			textBoardRepository.save(textBoard);
			return true;
		} catch (Exception e) {
			log.error("게시글 수정 실패 : {}",e.getMessage());
			return false;
		}
	}
	@Transactional // 일련의 과정중에 오류가 하나라도 생기면 롤백됨
	public Long createBoard(TextBoardReqDto textBoardReqDto, String token) {
		try {
			Member member = memberService.convertTokenToEntity(token);
			if(member == null) {return null;}
			TextBoard textBoard = new TextBoard();
			textBoard.setActive(Active.ACTIVE);
			textBoard.setTitle(textBoardReqDto.getTitle());
			textBoard.setContent(textBoardReqDto.getContent());
			textBoard.setTextCategory(TextCategory.fromString(textBoardReqDto.getTextCategory()));
			textBoard.setMember(member);
			textBoardRepository.save(textBoard);
			return textBoard.getTextId();
		} catch (Exception e) {
			log.error("게시글 등록 실패 : {}",e.getMessage());
			return null;
		}
	}
	// 게시글 상세 조회
	public TextBoardResDto findByBoardId (Long id) {
		try {
			TextBoard textBoard = textBoardRepository.findByTextId(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			return boardToBoardResDto(textBoard);
		} catch (Exception e) {
			log.error("게시글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	public TextBoardResDto loadByBoardId (Long id, String token) {
		try {
			TextBoard textBoard = textBoardRepository.findByTextId(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			Member member = memberService.convertTokenToEntity(token);
			return (member.equals(textBoard.getMember())) ? boardToBoardResDto(textBoard) : null;
		} catch (Exception e) {
			log.error("게시글 불러오기 중 오류 : {}",e.getMessage());
			return null;
		}
	}
	
	// 카테고리별 게시글 전체 조회
	public List<TextBoardListResDto> findBoardAllByCategory(String category, int page, int size, String sort, String active) {
		Pageable pageable = getPageable(page, size, sort);
		try {
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategory(Active.fromString(active), TextCategory.fromString(category), pageable).getContent();
			List<TextBoardListResDto> textBoardResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("서비스에서 글 목록 {}개 조회 : {}", textBoardResDtoList.size(), textBoardResDtoList);
			return textBoardResDtoList;
		} catch (Exception e) {
			log.error("전체 글 조회중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	// 카테고리별 게시글의 페이지 수 조회
	public int getBoardPageCount(String category, int size, String active) {
		try {
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategory(Active.fromString(active), TextCategory.fromString(category), pageRequest).getTotalPages();
			log.warn("서비스에서 카테고리별 페이지수 : {}", page);
			return page;
		} catch (Exception e) {
			log.error("전체 글 페이지 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(제목)
	public List<TextBoardListResDto> findBoardByTitle(String category, String keyword, int page, int size, String sort, String active) {
		try {
			Pageable pageable = getPageable(page, size, sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndTitleContaining(Active.fromString(active), TextCategory.fromString(category), keyword, pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("제목 검색으로 인한 결과 {}개 : {}", textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("제목을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	// 검색 페이지 계산 (제목)
	public int getBoardPageCountByTitle(String category, String keyword, int size, String active) {
		try {
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndTitleContaining(Active.fromString(active), TextCategory.fromString(category), keyword, pageRequest).getTotalPages();
			log.warn("제목 검색으로 인한 페이지 : {}", page);
			return page;
		} catch (Exception e) {
			log.error("제목을 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(작성자)
	public List<TextBoardListResDto> findBoardByNickName(String category, String keyword, int page, int size, String sort, String active) {
		try {
			Pageable pageable = getPageable(page, size, sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndMember_NickNameContaining(Active.fromString(active), TextCategory.fromString(category), keyword, pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("작성자 검색으로 인한 결과 {}개 : {}", textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("작성자를 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	// 검색 페이지 계산 (작성자)
	public int getBoardPageCountByNickName(String category, String keyword, int size, String active) {
		try {
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndMember_NickNameContaining(Active.fromString(active), TextCategory.fromString(category), keyword, pageRequest).getTotalPages();
			log.warn("작성자 검색으로 인한 페이지 : {}", page);
			return page;
		} catch (Exception e) {
			log.error("작성자를 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(제목 + 내용)
	public List<TextBoardListResDto> findBoardByTitleAndContent(String category, String keyword, int page, int size, String sort, String active) {
		try {
			Pageable pageable = getPageable(page, size, sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndTitleContainingOrContentContaining(Active.fromString(active), TextCategory.fromString(category), keyword, keyword, pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("제목과 내용 검색으로 인한 결과 {}개 : {}", textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("제목과 내용을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	// 검색 페이지 계산 (제목 + 내용)
	public int getBoardPageCountByTitleAndContent(String category, String keyword, int size, String active) {
		try {
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndTitleContainingOrContentContaining(Active.fromString(active), TextCategory.fromString(category), keyword, keyword, pageRequest).getTotalPages();
			log.warn("제목과 내용 검색으로 인한 페이지 : {}", page);
			return page;
		} catch (Exception e) {
			log.error("제목과 내용을 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(제목 + 내용)
	@Transactional
	public List<TextBoardListResDto> findBoardByMember(String category, Long memberId, int page, int size, String sort, String active) {
		try {
			Member member = memberRepository.findByMemberId(memberId)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			Pageable pageable = getPageable(page, size, sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndMember(Active.fromString(active), TextCategory.fromString(category), member, pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("회원 검색으로 인한 결과 {}개 : {}", textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("회원을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	// 검색 페이지 계산 (제목 + 내용)
	@Transactional
	public int getBoardPageCountByMember(String category, Long memberId, int size, String active) {
		try {
			Member member = memberRepository.findByMemberId(memberId)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndMember(Active.fromString(active), TextCategory.fromString(category), member, pageRequest).getTotalPages();
			log.warn("회원 검색으로 인한 페이지 : {}", page);
			return page;
		} catch (Exception e) {
			log.error("회원을 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	
	
	// 게시글 수정
	@Transactional
	public boolean updateBoard(TextBoardReqDto textBoardReqDto, String token) {
		try{
			TextBoard textBoard = textBoardRepository.findByTextId(textBoardReqDto.getTextId())
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			Member member = memberService.convertTokenToEntity(token);
			if(member.equals(textBoard.getMember())) {
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
	
	// 게시글 삭제 = Active 를 INACTIVE 로 설정
	public boolean deleteBoard(Long id, String token) {
		try {
			TextBoard board = textBoardRepository.findByTextId(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			Member member = memberService.convertTokenToEntity(token);
			if(member.equals(board.getMember())) {
				board.setActive(Active.INACTIVE);
				textBoardRepository.save(board);
				return true;
			}
			log.error("삭제하려는 글의 작성자가 아닙니다.");
			return false;
		} catch (Exception e) {
			log.error("게시글 삭제중 오류가 생겼습니다 : {}",e.getMessage());
			return false;
		}
	}
	public String isAuthor(Long id, String token) {
		try {
			TextBoard board = textBoardRepository.findByTextId(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 없습니다."));
			Member member = memberService.convertTokenToEntity(token);
			if (board.getMember().equals(member)) {
				return "/post/create/" + board.getTextCategory() + "/" + board.getTextId();
			}
			return null;
		} catch (Exception e) {
			log.error("작성자인지 확인중 오류가 생겼습니다 : {}",e.getMessage());
			return null;
		}
	}
	@Transactional
	public boolean createComment(CommentReqDto commentReqDto, String token) {
		try{
			TextBoard textBoard = textBoardRepository.findByTextId(commentReqDto.getBoardId())
				.orElseThrow(() -> new RuntimeException("해당 게시글이 없습니다."));
			Member member = memberService.convertTokenToEntity(token);
			Comment comment = new Comment();
			comment.setContent(commentReqDto.getContent());
			comment.setMember(member);
			comment.setTextBoard(textBoard);
			comment.setActive(Active.ACTIVE);
			commentRepository.save(comment);
			return true;
		} catch (Exception e) {
			log.error("댓글 생성 중 에러 : {}",e.getMessage());
			return false;
		}
	}
	
	public boolean deleteComment(CommentReqDto dto, String token) {
		try{
			TextBoard textBoard = textBoardRepository.findByTextId(dto.getBoardId())
				.orElseThrow(() -> new RuntimeException("해당 게시글이 없습니다."));
			Member member = memberService.convertTokenToEntity(token);
			Comment comment = commentRepository.findByCommentId(dto.getCommentId())
				.orElseThrow(() -> new RuntimeException("해당 댓글이 존재하지 않습니다."));
			if(!comment.getMember().equals(member)) throw new RuntimeException("해당 댓글의 작성자가 아닙니다.");
			if(!comment.getTextBoard().equals(textBoard)) throw  new RuntimeException("해당 게시글의 댓글이 아닙니다.");
			comment.setActive(Active.INACTIVE);
			commentRepository.save(comment);
			return true;
		} catch (Exception e) {
			log.error("댓글 삭제 중 에러 : {}",e.getMessage());
			return false;
		}
	}
	
	public boolean updateComment(CommentReqDto commentReqDto, String token) {
		try{
			TextBoard textBoard = textBoardRepository.findByTextId(commentReqDto.getBoardId())
				.orElseThrow(() -> new RuntimeException("해당 게시글이 없습니다."));
			Member member = memberService.convertTokenToEntity(token);
			Comment comment = commentRepository.findByCommentId(commentReqDto.getCommentId())
				.orElseThrow(() -> new RuntimeException("해당 댓글이 존재하지 않습니다."));
			if(!comment.getMember().equals(member)) throw new RuntimeException("해당 댓글의 작성자가 아닙니다.");
			if(!comment.getTextBoard().equals(textBoard)) throw  new RuntimeException("해당 게시글의 댓글이 아닙니다.");
			comment.setContent(commentReqDto.getContent());
			commentRepository.save(comment);
			return true;
		} catch (Exception e) {
			log.error("댓글 수정 중 에러 : {}",e.getMessage());
			return false;
		}
	}
	
	public List<CommentResDto> getCommentList(Long boardId, int page, int size, String token) {
		try{
			Member member = memberService.convertTokenToEntity(token);
			
			PageRequest pageRequest = PageRequest.of(page, size);
			TextBoard textBoard = textBoardRepository.findByTextId(boardId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			List<Comment> commentList = commentRepository.findByTextBoardAndActive(textBoard, Active.ACTIVE, pageRequest).getContent();
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for (Comment comment : commentList) {
				CommentResDto commentResDto = new CommentResDto();
				commentResDto.setContent(comment.getContent());
				commentResDto.setBoardId(textBoard.getTextId());
				commentResDto.setRegDate(comment.getRegDate());
				commentResDto.setNickName(comment.getMember().getNickName());
				commentResDto.setCommentId(comment.getCommentId());
				commentResDto.setOwner(comment.getMember().equals(member));
				commentResDtoList.add(commentResDto);
			}
			log.warn("회원 {}의 게시글 번호 : {} 에 대한 댓글 리스트 반환 : {}", member, boardId, commentResDtoList);
			return commentResDtoList;
		} catch (Exception e) {
			log.error("댓글 조회 중 에러 발생 : {}",e.getMessage());
			return null;
		}
	}
	
	public List<CommentResDto> getPublicCommentList(Long boardId, int page, int size) {
		try{
			PageRequest pageRequest = PageRequest.of(page, size);
			TextBoard textBoard = textBoardRepository.findByTextId(boardId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			List<Comment> commentList = commentRepository.findByTextBoardAndActive(textBoard, Active.ACTIVE, pageRequest).getContent();
			List<CommentResDto> commentResDtoList = new ArrayList<>();
			for (Comment comment : commentList) {
				CommentResDto commentResDto = new CommentResDto();
				commentResDto.setContent(comment.getContent());
				commentResDto.setBoardId(textBoard.getTextId());
				commentResDto.setRegDate(comment.getRegDate());
				commentResDto.setNickName(comment.getMember().getNickName());
				commentResDto.setCommentId(comment.getCommentId());
				commentResDtoList.add(commentResDto);
			}
			log.warn("게시글 번호 : {} 에 대한 댓글 리스트 반환 : {}", boardId, commentResDtoList);
			return commentResDtoList;
		} catch (Exception e) {
			log.error("댓글 조회 중 에러 발생 : {}",e.getMessage());
			return null;
		}
	}
	
	public int getCommentMaxPage(Long boardId, int size){
		try{
			log.warn("최대 페이지 : {}-{}",boardId,size);
			PageRequest pageRequest = PageRequest.of(0, size);
			TextBoard textBoard = textBoardRepository.findByTextId(boardId)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			int maxPage = commentRepository.findByTextBoardAndActive(textBoard, Active.ACTIVE, pageRequest).getTotalPages();
			log.warn("페이지 조회 : {}", maxPage);
			return maxPage;
		} catch (Exception e) {
			log.error("페이지 조회중 오류 : {}",e.getMessage());
			return -1;
		}
	}
	
	// TextBoard 객체를 TextBoardResDto로 바꿔주는 메서드
	private TextBoardResDto boardToBoardResDto(TextBoard textBoard) {
		TextBoardResDto textBoardResDto = new TextBoardResDto();
		textBoardResDto.setBoardId(textBoard.getTextId());
		textBoardResDto.setTitle(textBoard.getTitle());
		textBoardResDto.setContent(textBoard.getContent());
		textBoardResDto.setTextCategory(textBoard.getTextCategory());
		if(!textBoard.getTextCategory().equals(TextCategory.FAQ)){
			textBoardResDto.setRegDate(textBoard.getRegDate());
			textBoardResDto.setNickName(textBoard.getMember().getNickName());
		}
		return textBoardResDto;
	}
	// TextBoard 객체를 TextBoardListResDto로 바꿔주는 메서드
	public List<TextBoardListResDto> boardToBoardListResDto(List<TextBoard> textBoardList) {
		List<TextBoardListResDto> textBoardListResDtoList = new ArrayList<>();
		log.warn("호출 : {}",textBoardList.size());
		for (TextBoard textBoard : textBoardList) {
			TextBoardListResDto textBoardListResDto = new TextBoardListResDto();
			textBoardListResDto.setBoardId(textBoard.getTextId());
			textBoardListResDto.setTitle(textBoard.getTitle());
			if(!textBoard.getTextCategory().equals(TextCategory.FAQ)){
				textBoardListResDto.setNickName(textBoard.getMember().getNickName());
				textBoardListResDto.setRegDate(textBoard.getRegDate());
				textBoardListResDto.setSummary(getSummaryWithEllipsis(textBoard.getContent()));
			}
			textBoardListResDtoList.add(textBoardListResDto);
		}
		return textBoardListResDtoList;
	}
	public String getSummaryWithEllipsis(String content) {
		// 최대 20자까지만 잘라서 "..."을 붙임
		return content.length() > 20 ? content.substring(0, 20) + "..." : content;
	}
	
	public PageRequest getPageable(int page, int size, String sort) {
		log.warn("페이지 객체 호출");
		if (sort == null || (!sort.equals("asc") && !sort.equals("desc"))) {
			log.warn("정렬 기준이 잘못되었습니다. 기본값(내림차순)을 사용합니다. sort : {}", sort);
			sort = "desc";  // 기본값으로 내림차순을 설정
		}
		
		return switch (sort) {
			case "asc" -> PageRequest.of(page, size, Sort.by(Sort.Order.asc("regDate"))); // 정렬 기준을 regDate로 수정
			case "desc" -> PageRequest.of(page, size, Sort.by(Sort.Order.desc("regDate"))); // 정렬 기준을 regDate로 수정
			default -> PageRequest.of(page, size, Sort.by(Sort.Order.desc("regDate"))); // 기본값으로 내림차순
		};
	}
}
