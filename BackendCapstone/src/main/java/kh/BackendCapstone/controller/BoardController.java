package kh.BackendCapstone.controller;

import com.kh.springJpa241217.dto.request.BoardReqDto;
import com.kh.springJpa241217.dto.response.BoardResDto;
import com.kh.springJpa241217.service.BoardService;
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
public class BoardController {
	private final BoardService boardService;
	
	@PostMapping("/create")
	public ResponseEntity<Boolean> createBoard(@RequestBody BoardReqDto boardReqDto) {
		boolean isSuccess =  boardService.saveBoard(boardReqDto);
		log.warn("작성 글 생성({}) : {}", isSuccess, boardReqDto);
		return ResponseEntity.ok(isSuccess);
	}
	
	@GetMapping("/find/id/{boardId}")
	public ResponseEntity<BoardResDto> findBoardById(@PathVariable("boardId") Long boardId) {
		BoardResDto rsp = boardService.findByBoardId(boardId);
		log.warn("글번호 {} 의 글 내용 조회 : {}", boardId, rsp);
		return ResponseEntity.ok(rsp);
	}
	@GetMapping("/find")
	public ResponseEntity<List<BoardResDto>> findBoardAll() {
		List<BoardResDto> rsp = boardService.findBoardAll();
		log.warn("전체 글의 글 {}개의 내용 조회 : {}",rsp.size(), rsp);
		return ResponseEntity.ok(rsp);
	}
	@GetMapping("find/title/{title}")
	public ResponseEntity<List<BoardResDto>> findBoardByTitle(@PathVariable("title") String title) {
		List<BoardResDto> rsp = boardService.findBoardByTitle(title);
		log.warn("글 제목 : {} ,로 검색한 {}개의 내용 조회 : {}",title,rsp.size(), rsp);
		return ResponseEntity.ok(rsp);
	}
	@PostMapping("/update/{boardId}")
	public ResponseEntity<Boolean> updateBoard(@RequestBody BoardReqDto boardReqDto, @PathVariable Long boardId) {
		boolean isSuccess = boardService.updateBoard(boardReqDto, boardId);
		log.warn("글번호 : {} 에대한 글 수정 {} 항목 : {}", boardId, isSuccess, boardReqDto);
		return ResponseEntity.ok(isSuccess);
	}
	@PostMapping("/delete/{boardId}/{email}")
	public ResponseEntity<Boolean> deleteBoard(@PathVariable("boardId") Long boardId, @PathVariable String email) {
		boolean isSuccess = boardService.deleteBoard(email,boardId);
		log.warn("email : {}의 글번호 : {} 삭제 요청 : {}", email, boardId, isSuccess);
		return ResponseEntity.ok(isSuccess);
	}
	@GetMapping("page/titleOrContent/{keyword}/{size}")
	public ResponseEntity<Integer> findBoardPageByTitleOrContent(@PathVariable String keyword, @PathVariable int size) {
		int pageCount = boardService.findBoardPageByTitleOrContent(keyword, size);
		log.warn("제목과 내용 검색 : {} 에 대한 페이지당 : {} 페이지 수 : {}", keyword, size, pageCount);
		return ResponseEntity.ok(pageCount);
	}
	@GetMapping("/titleOrContent/{keyword}/{size}/{page}")
	public ResponseEntity<List<BoardResDto>> findBoardByTitleOrContent(@PathVariable String keyword, @PathVariable int size, @PathVariable int page) {
		List<BoardResDto> rsp = boardService.findBoardByTitleOrContent(keyword, size, page);
		log.warn("제목과 내용 검색 : {}, 페이지당 {} 인 페이지 {} 의 검색된 개수 : {} 결과 : {}", keyword, size, page, rsp.size(),rsp);
		return ResponseEntity.ok(rsp);
	}
	
	
	
	
	
}
