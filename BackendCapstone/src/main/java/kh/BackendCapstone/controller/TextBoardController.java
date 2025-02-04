package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.CommentReqDto;
import kh.BackendCapstone.dto.request.TextBoardReqDto;
import kh.BackendCapstone.dto.response.CommentResDto;
import kh.BackendCapstone.dto.response.TextBoardListResDto;
import kh.BackendCapstone.dto.response.TextBoardResDto;
import kh.BackendCapstone.service.TextBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/board")
@Slf4j
public class TextBoardController {
	private final TextBoardService textBoardService;
	
	// 글 작성
	@PostMapping("/create")
	public ResponseEntity<Long> createBoard(@RequestBody TextBoardReqDto textBoardReqDto, @RequestHeader("Authorization") String token) {
		Long isSuccess =  textBoardService.createBoard(textBoardReqDto, token);
		log.warn("작성 글 생성({}) : {}", isSuccess, textBoardReqDto);
		return ResponseEntity.ok(isSuccess);
	}
	// 글 세부 조회
	@GetMapping("/find/id/{boardId}")
	public ResponseEntity<TextBoardResDto> findBoardById(@PathVariable("boardId") Long boardId) {
		TextBoardResDto rsp = textBoardService.findByBoardId(boardId);
		log.warn("글번호 {} 의 글 내용 조회 : {}", boardId, rsp);
		return ResponseEntity.ok(rsp);
	}
	// 글 수정을 위한 조회
	@GetMapping("/load/id/{boardId}")
	public ResponseEntity<TextBoardResDto> loadBoardById(@PathVariable("boardId") Long boardId, @RequestHeader("Authorization") String token) {
		TextBoardResDto rsp = textBoardService.loadByBoardId(boardId, token);
		log.warn("글번호 {} 의 글 내용 불러오기 : {}", boardId, rsp);
		return ResponseEntity.ok(rsp);
	}
	
	// 카테고리별 전체 글 조회
	@GetMapping("/page/{category}")
	public ResponseEntity<Integer> findBoardPageAll(@PathVariable String category, @RequestParam int size, @RequestParam String active) {
		int pageCount = textBoardService.getBoardPageCount(category, size, active);
		log.warn("카테고리 : {} 에 대한 페이지당 : {} 페이지 수 : {} 활성화 상태 : {}", category, size, pageCount, active);
		return ResponseEntity.ok(pageCount);
	}
	
	@GetMapping("/find/{category}")
	public ResponseEntity<List<TextBoardListResDto>> findBoardAll(@PathVariable String category, @RequestParam int page, @RequestParam int size, @RequestParam(defaultValue = "desc") String sort, @RequestParam String active) {
		List<TextBoardListResDto> rsp = textBoardService.findBoardAllByCategory(category, page, size, sort, active);
		log.warn("카테고리 : {} 전체 글 {}개의 내용 조회 (활성화 상태: {}) : {}", category, rsp.size(), active, rsp);
		return ResponseEntity.ok(rsp);
	}
	
	// 카테고리별 제목 검색
	@GetMapping("/page/title/{category}/{title}")
	public ResponseEntity<Integer> findBoardPageByTitle(@PathVariable String category, @PathVariable String title, @RequestParam int size, @RequestParam String active) {
		int pageCount = textBoardService.getBoardPageCountByTitle(category, title, size, active);
		log.warn("카테고리 : {} 의 제목 검색 : {} 에대한 페이지당 : {} 페이지 수 : {} 활성화 상태 : {}", category, title, size, pageCount, active);
		return ResponseEntity.ok(pageCount);
	}
	
	@GetMapping("/find/title/{category}/{title}")
	public ResponseEntity<List<TextBoardListResDto>> findBoardByTitle(@PathVariable String category, @PathVariable String title,
	                                                                  @RequestParam int page, @RequestParam int size, @RequestParam(defaultValue = "desc") String sort, @RequestParam String active) {
		List<TextBoardListResDto> rsp = textBoardService.findBoardByTitle(category, title, page, size, sort, active);
		log.warn("카테고리 : {} 글 제목 : {} ,로 검색한 {}개의 내용 조회 (활성화 상태: {}) : {}", category, title, rsp.size(), active, rsp);
		return ResponseEntity.ok(rsp);
	}
	
	// 카테고리별 닉네임 검색
	@GetMapping("/page/nickName/{category}/{nickName}")
	public ResponseEntity<Integer> findBoardByNickName(@PathVariable String category, @PathVariable String nickName, @RequestParam int size, @RequestParam String active) {
		int pageCount = textBoardService.getBoardPageCountByNickName(category, nickName, size, active);
		log.warn("카테고리 : {} 의 작성자 검색 : {} 에대한 페이지당 : {} 페이지 수 : {} 활성화 상태 : {}", category, nickName, size, pageCount, active);
		return ResponseEntity.ok(pageCount);
	}
	
	@GetMapping("/find/nickName/{category}/{nickName}")
	public ResponseEntity<List<TextBoardListResDto>> findBoardByNickName(@PathVariable String category, @PathVariable String nickName,
	                                                                     @RequestParam int page, @RequestParam int size, @RequestParam(defaultValue = "desc") String sort, @RequestParam String active) {
		List<TextBoardListResDto> rsp = textBoardService.findBoardByNickName(category, nickName, page, size, sort, active);
		log.warn("카테고리 : {} 글 작성자 : {} ,로 검색한 {}개의 내용 조회 (활성화 상태: {}) : {}", category, nickName, rsp.size(), active, rsp);
		return ResponseEntity.ok(rsp);
	}
	
	// 카테고리별 제목 및 내용 검색
	@GetMapping("page/titleOrContent/{category}/{keyword}")
	public ResponseEntity<Integer> findBoardPageByTitleOrContent(@PathVariable String category, @PathVariable String keyword, @RequestParam int size, @RequestParam String active) {
		int pageCount = textBoardService.getBoardPageCountByTitleAndContent(category, keyword, size, active);
		log.warn("카테고리 : {} 제목과 내용 검색 : {} 에 대한 페이지당 : {} 페이지 수 : {} 활성화 상태 : {}", category, keyword, size, pageCount, active);
		return ResponseEntity.ok(pageCount);
	}
	
	@GetMapping("/find/titleOrContent/{category}/{keyword}")
	public ResponseEntity<List<TextBoardListResDto>> findBoardByTitleOrContent(@PathVariable String category, @PathVariable String keyword,
	                                                                           @RequestParam int size, @RequestParam int page, @RequestParam(defaultValue = "desc") String sort, @RequestParam String active) {
		List<TextBoardListResDto> rsp = textBoardService.findBoardByTitleAndContent(category ,keyword, size, page, sort, active);
		log.warn("카테고리 : {} 제목과 내용 검색 : {}, 페이지당 {} 인 페이지 {} 의 검색된 개수 : {} (활성화 상태: {}) 결과 : {}", category, keyword, size, page, rsp.size(), active, rsp);
		return ResponseEntity.ok(rsp);
	}
	
	// 카테고리별 회원 검색
	@GetMapping("/page/member/{category}/{memberId}")
	public ResponseEntity<Integer> findBoardByMember(@PathVariable String category, @PathVariable Long memberId, @RequestParam int size, @RequestParam String active) {
		int pageCount = textBoardService.getBoardPageCountByMember(category, memberId, size, active);
		log.warn("카테고리 : {} 의 회원 검색 : {} 에대한 페이지당 : {} 페이지 수 : {}", category, memberId, size, pageCount);
		return ResponseEntity.ok(pageCount);
	}
	@GetMapping("/find/member/{category}/{memberId}")
	public ResponseEntity<List<TextBoardListResDto>> findBoardByMember(@PathVariable String category, @PathVariable Long memberId,
	                                                                     @RequestParam int page, @RequestParam int size, @RequestParam(defaultValue = "desc") String sort, @RequestParam String activ) {
		List<TextBoardListResDto> rsp = textBoardService.findBoardByMember(category, memberId, page, size, sort, activ);
		log.warn("카테고리 : {} 글 회원 : {} ,로 검색한 {}개의 내용 조회 : {}", category, memberId, rsp.size(), rsp);
		return ResponseEntity.ok(rsp);
	}
	
	@PostMapping("/update")
	public ResponseEntity<Boolean> updateBoard(@RequestBody TextBoardReqDto textBoardReqDto, @RequestHeader("Authorization") String token) {
		boolean isSuccess = textBoardService.updateBoard(textBoardReqDto, token);
		log.warn("글 수정 {} 항목 : {}", isSuccess, textBoardReqDto);
		return ResponseEntity.ok(isSuccess);
	}
	@DeleteMapping("/delete/{boardId}")
	public ResponseEntity<Boolean> deleteBoard(@PathVariable("boardId") Long boardId, @RequestHeader("Authorization") String token) {
		boolean isSuccess = textBoardService.deleteBoard(boardId, token);
		log.warn("글번호 : {} 삭제 요청 : {}", boardId, isSuccess);
		return ResponseEntity.ok(isSuccess);
	}
	
	@GetMapping("/isAuthor/{boardId}")
	public ResponseEntity<String> isAuthor(@PathVariable("boardId") Long boardId, @RequestHeader("Authorization") String token) {
		String isSuccess = textBoardService.isAuthor(boardId, token);
		log.warn("글번호{} 의 작성자인지 여부 : {} ", boardId, isSuccess);
		return ResponseEntity.ok(isSuccess);
	}
	
	@GetMapping("/list/comment/{boardId}")
	public ResponseEntity<List<CommentResDto>> getCommentList(@PathVariable("boardId") Long boardId, @RequestParam int page, @RequestParam int size, @RequestHeader("Authorization") String token) {
		List<CommentResDto> commentResDtoList = textBoardService.getCommentList(boardId, page, size, token);
		return ResponseEntity.ok(commentResDtoList);
	}
	@GetMapping("/list/comment/public/{boardId}")
	public ResponseEntity<List<CommentResDto>> getPublicCommentList(@PathVariable("boardId") Long boardId, @RequestParam int page, @RequestParam int size){
		List<CommentResDto> commentResDtoList = textBoardService.getPublicCommentList(boardId, page, size);
		return ResponseEntity.ok(commentResDtoList);
	}
	
	@GetMapping("/page/comment/{boardId}")
	public ResponseEntity<Integer> getCommentMaxPage(@PathVariable("boardId") Long boardId, @RequestParam int size) {
		int maxPage = textBoardService.getCommentMaxPage(boardId, size);
		return ResponseEntity.ok(maxPage);
	}
	
	@PostMapping("/create/comment")
	public ResponseEntity<Boolean> createComment(@RequestBody CommentReqDto commentReqDto, @RequestHeader("Authorization") String token) {
		boolean isSuccess = textBoardService.createComment(commentReqDto, token);
		return ResponseEntity.ok(isSuccess);
	}
	@PostMapping("/update/comment")
	public ResponseEntity<Boolean> updateComment(@RequestBody CommentReqDto commentReqDto, @RequestHeader("Authorization") String token) {
		boolean isSuccess = textBoardService.updateComment(commentReqDto, token);
		return ResponseEntity.ok(isSuccess);
	}
	@PostMapping("/delete/comment")
	public ResponseEntity<Boolean> deleteComment(@RequestHeader("Authorization") String token, @RequestBody CommentReqDto commentReqDto) {
		boolean isSuccess = textBoardService.deleteComment(commentReqDto, token);
		return ResponseEntity.ok(isSuccess);
	}
}