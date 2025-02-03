package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.CommentReqDto;
import kh.BackendCapstone.dto.response.CommentResDto;
import kh.BackendCapstone.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
public class CommentController {
	private final CommentService commentService;
	// 댓글 등록
//	@PostMapping("/create")
//	public ResponseEntity<Boolean> commentRegister(@RequestBody CommentReqDto commentReqDto) {
//		boolean isSuccess = commentService.commentRegister(commentReqDto);
//		log.warn("댓글 등록 : {} , 댓글 내용 : {}", isSuccess, commentReqDto);
//		return ResponseEntity.ok(isSuccess);
//	}
//	// 댓글 조회
//	@GetMapping("/getAll/{boardId}")
//	public ResponseEntity<List<CommentResDto>> getCommentByBoardId(@PathVariable("textId") Long textId) {
//		List<CommentResDto> rsp = commentService.findCommentByBoardId(textId);
//		log.warn("댓글 조회 글번호 : {} 에 대한 개수 : {} 내용 : {}", textId, rsp.size(), rsp);
//		return ResponseEntity.ok(rsp);
//	}
//	// 댓글 삭제
//	@PostMapping("/delete")
//	public ResponseEntity<Boolean> commentDelete(@RequestParam Long commentId, @RequestParam Long boardId, @RequestParam String email) {
//		boolean isSuccess = commentService.deleteComment(commentId, boardId, email);
//		log.warn("댓글 삭제 {} 댓글번호 : {}, 글번호 : {}, 이메일 : {}", isSuccess, commentId, boardId, email);
//		return ResponseEntity.ok(isSuccess);
//	}
}
