package kh.BackendCapstone.controller;

import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.dto.response.FileBoardResDto;
import kh.BackendCapstone.dto.response.UnivResponse;
import kh.BackendCapstone.service.FileBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
			log.info("ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ{}",response);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	@PostMapping("/save")
	public ResponseEntity<String> saveFileBoard(
			@RequestParam("title") String title,
			@RequestParam("mainFile") MultipartFile mainFile,
			@RequestParam(value = "preview", required = false) MultipartFile preview,
			@RequestParam(value = "summary", required = false) String summary,
			@RequestParam("price") int price,
			@RequestParam("fileCategory") FileCategory fileCategory,
			@RequestParam(value = "keywords", required = false) String keywordsJson) {

		try {

			// mainFile이 null이 아니고, 파일이 비어 있지 않다면
			if (mainFile == null || mainFile.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Main file is required.");
			}

			// preview 파일이 null이거나 비어있다면 콘솔에 출력하고 진행
			if (preview == null || preview.isEmpty()) {
				System.out.println("No preview file provided. Proceeding without it.");
			} else {
				// preview 파일이 존재하면, getOriginalFilename을 안전하게 호출할 수 있습니다.
				String previewFileName = preview.getOriginalFilename();
				System.out.println("Preview file: " + previewFileName);
			}

			if (summary == null || summary.trim().isEmpty()) {
				summary = "No summary provided"; // 기본값 설정
			}

			if (keywordsJson == null || keywordsJson.trim().isEmpty()) {
				keywordsJson = "{}"; // 빈 JSON 객체로 설정
			}

			// 서비스 호출
			fileBoardService.saveFileBoard(title, mainFile, preview, summary, price, fileCategory, keywordsJson);
			return ResponseEntity.ok("파일 저장 성공");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
		}
	}
}
