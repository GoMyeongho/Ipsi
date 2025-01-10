package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.response.FileBoardResDto;
import kh.BackendCapstone.dto.response.UnivResponse;
import kh.BackendCapstone.service.FileBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j // 로깅 기능 추가
@RequiredArgsConstructor // final 필드와 @NonNull 필드에 대해 생성자를 자동으로 생성
@RestController // 해당 클래스가 RESTful 웹 서비스를 처리하는 컨트롤러임을 나타냄, 모든 메서드의 반환 값은 자동으로 JSON 형태로 변환되어 HTTP 응답 본문에 포함됨
@RequestMapping("/file") // HTTP 요청의 URL(을) 특정 클래스나 메서드와 매핑
@CrossOrigin(origins = "http://localhost:3000") // CORS(Cross-Origin Resource Sharing)**를 설정, 이 경우 http://localhost:3000에서 오는 요청을 허용
public class FileBoardController {
	
	private final FileBoardService fileBoardService;
	
	// 대학 정보 조회
	@GetMapping("/list")
	public ResponseEntity<UnivResponse> getResumeList(
		@RequestParam int page,
		@RequestParam int limit,
		@RequestParam(required = false) String univName,
		@RequestParam(required = false) String univDept) {
		try {
			// 대학 정보와 페이지 수를 한 번에 가져옴
			List<FileBoardResDto> fileBoardResDtos = fileBoardService.getContents(page, limit, univName, univDept, "ps");
			int totalPages = fileBoardService.getPageSize(limit, univName, univDept, "ps");
			
			// DTO로 응답 반환
			UnivResponse response = new UnivResponse(fileBoardResDtos, totalPages);
//            log.info("{}",response);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}
}
