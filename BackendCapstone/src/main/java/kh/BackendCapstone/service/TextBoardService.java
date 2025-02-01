package kh.BackendCapstone.service;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.TextCategory;
import kh.BackendCapstone.dto.request.TextBoardReqDto;
import kh.BackendCapstone.dto.response.TextBoardListResDto;
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
	
	// 게시글 등록
	@Transactional // 일련의 과정중에 오류가 하나라도 생기면 롤백됨
	public boolean saveBoard(TextBoardReqDto textBoardReqDto) {
		try {
			Member member = memberRepository.findByEmail(textBoardReqDto.getEmail())
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));

			TextBoard textBoard = new TextBoard();
			textBoard.setActive(Active.ACTIVE);
			textBoard.setTitle(textBoardReqDto.getTitle());
			textBoard.setContent(textBoardReqDto.getContent());
			textBoard.setTextCategory(TextCategory.fromString(textBoardReqDto.getTextCategory()));
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
			return boardToBoardResDto(textBoard);
		} catch (Exception e) {
			log.error("게시글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	public TextBoardResDto loadByBoardId (Long id, String token) {
		try {
			TextBoard textBoard = textBoardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			Member member = memberService.convertTokenToEntity(token);
			return (member.equals(textBoard.getMember())) ? boardToBoardResDto(textBoard) : null;
		} catch (Exception e) {
			log.error("게시글 불러오기 중 오류 : {}",e.getMessage());
			return null;
		}
	}
	
	// 카테고리별 게시글 전체 조회
	public List<TextBoardListResDto> findBoardAllByCategory(String category, int page, int size, String sort) {
		Pageable pageable = getPageable(page,size,sort);
		try {
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategory(Active.ACTIVE, TextCategory.fromString(category), pageable).getContent();
			List<TextBoardListResDto> textBoardResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("서비스에서 글 목록 {}개 조회 : {}",textBoardResDtoList.size(), textBoardResDtoList);
			return textBoardResDtoList;
		} catch (Exception e) {
			log.error("전체 글 조회중 오류 : {}",e.getMessage());
			return null;
		}
	}
	// 카테고리별 게시글의 페이지 수 조회
	public int getBoardPageCount(String category, int size) {
		try{
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategory(Active.ACTIVE, TextCategory.fromString(category),pageRequest).getTotalPages();
			log.warn("서비스에서 카테고리별 페이지수 : {}",page);
			return page;
		} catch (Exception e) {
			log.error("전체 글 페이지 계산중 오류 : {}",e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(제목)
	public List<TextBoardListResDto> findBoardByTitle(String category, String keyword, int page, int size, String sort) {
		try {
			Pageable pageable = getPageable(page,size,sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndTitleContaining(Active.ACTIVE,TextCategory.fromString(category),keyword,pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("제목 검색으로 인한 결과 {}개 : {}",textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("제목을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	// 검색 페이지 계산 (제목)
	public int getBoardPageCountByTitle(String category, String keyword, int size) {
		try{
			
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndTitleContaining
				(Active.ACTIVE, TextCategory.fromString(category), keyword,pageRequest).getTotalPages();
			log.warn("제목 검색으로 인한 페이지 : {}",page);
			return page;
		} catch (Exception e) {
			log.error("제목을 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(작성자)
	public List<TextBoardListResDto> findBoardByNickName(String category, String keyword, int page, int size, String sort) {
		try {
			Pageable pageable = getPageable(page,size,sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndMember_NickNameContaining(Active.ACTIVE,TextCategory.fromString(category),keyword,pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("작성자 검색으로 인한 결과 {}개 : {}",textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("작성자를 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	// 검색 페이지 계산 (작성자)
	public int getBoardPageCountByNickName(String category, String keyword, int size) {
		try{
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndMember_NickNameContaining
				(Active.ACTIVE, TextCategory.fromString(category), keyword,pageRequest).getTotalPages();
			log.warn("작성자 검색으로 인한 페이지 : {}",page);
			return page;
		} catch (Exception e) {
			log.error("작성자를 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(제목 + 내용)
	public List<TextBoardListResDto> findBoardByTitleAndContent(String category, String keyword, int page, int size, String sort) {
		try {
			Pageable pageable = getPageable(page,size,sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndTitleContainingOrContentContaining(Active.ACTIVE,TextCategory.fromString(category),keyword,keyword,pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("제목과 내용 검색으로 인한 결과 {}개 : {}",textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("제목과 내용을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	// 검색 페이지 계산 (제목 + 내용)
	public int getBoardPageCountByTitleAndContent(String category, String keyword, int size) {
		try{
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndTitleContainingOrContentContaining
				(Active.ACTIVE, TextCategory.fromString(category), keyword, keyword,pageRequest).getTotalPages();
			log.warn("제목과 내용 검색으로 인한 페이지 : {}",page);
			return page;
		} catch (Exception e) {
			log.error("제목과 내용을 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
		}
	}
	
	// 카테고리별 검색(회원)
	public List<TextBoardListResDto> findBoardByMember(String category, String email, int page, int size, String sort) {
		try {
			Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			
			Pageable pageable = getPageable(page,size,sort);
			List<TextBoard> textBoardList = textBoardRepository.findByActiveAndTextCategoryAndMember(Active.ACTIVE,TextCategory.fromString(category),member,pageable).getContent();
			List<TextBoardListResDto> textBoardListResDtoList = boardToBoardListResDto(textBoardList);
			log.warn("회원 검색으로 인한 결과 {}개 : {}",textBoardListResDtoList.size(), textBoardListResDtoList);
			return textBoardListResDtoList;
		} catch (Exception e) {
			log.error("회원을 통해 검색중 오류 : {}", e.getMessage());
			return null;
		}
	}
	// 검색 페이지 계산 (회원)
	public int getBoardPageCountByMember(String category, String email, int size) {
		try{
			Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			
			PageRequest pageRequest = PageRequest.of(0, size);
			int page = textBoardRepository.findByActiveAndTextCategoryAndMember
				(Active.ACTIVE, TextCategory.fromString(category), member, pageRequest).getTotalPages();
			log.warn("회원 검색으로 인한 페이지 : {}",page);
			return page;
		} catch (Exception e) {
			log.error("회원을 통해 페이지수 계산중 오류 : {}", e.getMessage());
			return 0;
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
	
	// 게시글 삭제 = Active 를 INACTIVE 로 설정
	public boolean deleteBoard(String email, Long id) {
		try {
			TextBoard board = textBoardRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
			if(email.equals(board.getMember().getEmail())) {
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
