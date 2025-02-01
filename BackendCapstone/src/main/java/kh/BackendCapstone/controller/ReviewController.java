package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.ReviewReqDto;
import kh.BackendCapstone.dto.response.ReviewResDto;
import kh.BackendCapstone.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j // 로깅 기능 추가
@RequiredArgsConstructor // final 필드와 @NonNull 필드에 대해 생성자를 자동으로 생성
@RestController // 해당 클래스가 RESTful 웹 서비스를 처리하는 컨트롤러임을 나타냄, 모든 메서드의 반환 값은 자동으로 JSON 형태로 변환되어 HTTP 응답 본문에 포함됨
@RequestMapping("/review") // HTTP 요청의 URL(을) 특정 클래스나 메서드와 매핑
@CrossOrigin(origins = "http://localhost:3000") // CORS(Cross-Origin Resource Sharing)**를 설정, 이 경우 http://localhost:3000에서 오는 요청을 허용
public class ReviewController {

    private final ReviewService reviewService;

    // 자료 게시물 댓글 저장
    @PostMapping("inputReview")
    public ResponseEntity<ReviewResDto> saveReview(@RequestBody ReviewReqDto reviewReqtDto) {
        ReviewResDto responseDto = reviewService.saveReview(reviewReqtDto);
        return ResponseEntity.ok(responseDto);
    }

    // 자료 게시물 댓글 조회 (페이지네이션 추가)
    @GetMapping("/readReview")
    public ResponseEntity<Page<ReviewResDto>> getReview(@RequestParam Long fileBoardId,
                                                        @RequestParam int page,
                                                        @RequestParam int size) {
        try {
            // fileBoardId를 이용하여 댓글 목록을 페이지네이션 처리하여 가져옵니다.
            Page<ReviewResDto> response = reviewService.getReviewByFileBoardId(fileBoardId, page, size);

            if (response.isEmpty()) {
                return ResponseEntity.noContent().build(); // 댓글이 없으면 204 No Content 반환
            }

            log.warn("ddddddddddd{}",response);
            return ResponseEntity.ok(response); // 페이지네이션된 댓글 목록을 반환
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 서버 오류 시 500 반환
        }
    }
}
