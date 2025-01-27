package kh.BackendCapstone.controller;

import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.dto.response.FileBoardResDto;
import kh.BackendCapstone.dto.response.ContentsItemPageResDto;
import kh.BackendCapstone.dto.response.FilePurchaseStatusResDto;
import kh.BackendCapstone.service.FileBoardService;
import kh.BackendCapstone.service.PayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

@Slf4j // 로깅 기능 추가
@RequiredArgsConstructor // final 필드와 @NonNull 필드에 대해 생성자를 자동으로 생성
@RestController // 해당 클래스가 RESTful 웹 서비스를 처리하는 컨트롤러임을 나타냄, 모든 메서드의 반환 값은 자동으로 JSON 형태로 변환되어 HTTP 응답 본문에 포함됨
@RequestMapping("/file") // HTTP 요청의 URL(을) 특정 클래스나 메서드와 매핑
@CrossOrigin(origins = "http://localhost:3000") // CORS(Cross-Origin Resource Sharing)**를 설정, 이 경우 http://localhost:3000에서 오는 요청을 허용
public class FileBoardController {
	
	private final FileBoardService fileBoardService;
	private final PayService payService;

	@GetMapping("/psList")
	public ResponseEntity<ContentsItemPageResDto> getPersonalStatementList(
			@RequestParam int page,
			@RequestParam int limit,
			@RequestParam(required = false) String univName,
			@RequestParam(required = false) String univDept,
			@RequestParam(required = false) Long memberId // 요청 파라미터로 memberId 받기
	) {
		try {
			List<FileBoardResDto> fileBoardResDtos = fileBoardService.getContents(page, limit, univName, univDept, "ps");
			int totalPages = fileBoardService.getPageSize(limit, univName, univDept, "ps");

			List<FilePurchaseStatusResDto> filePurchaseStatus = new ArrayList<>();
			if (memberId != null && memberId > 0) {
				try {
					filePurchaseStatus = payService.getPurchasedFileStatusesByMemberId(memberId);
				} catch (EntityNotFoundException e) {
//					log.warn("No purchase information found for memberId: {}", memberId);
				}
			}

			ContentsItemPageResDto response = new ContentsItemPageResDto(fileBoardResDtos, totalPages, filePurchaseStatus);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error occurred while processing request", e);
			return ResponseEntity.status(500).body(null);
		}
	}

	@GetMapping("/srList")
	public ResponseEntity<ContentsItemPageResDto> getStudentRecordList(
			@RequestParam int page,
			@RequestParam int limit,
			@RequestParam(required = false) String univName,
			@RequestParam(required = false) String univDept,
			@RequestParam(required = false) Long memberId // 요청 파라미터로 memberId 받기
	) {
		try {
			List<FileBoardResDto> fileBoardResDtos = fileBoardService.getContents(page, limit, univName, univDept, "sr");
			int totalPages = fileBoardService.getPageSize(limit, univName, univDept, "sr");

			List<FilePurchaseStatusResDto> filePurchaseStatus = new ArrayList<>();
			if (memberId != null && memberId > 0) {
				try {
					filePurchaseStatus = payService.getPurchasedFileStatusesByMemberId(memberId);
				} catch (EntityNotFoundException e) {
//					log.warn("No purchase information found for memberId: {}", memberId);
				}
			}

			ContentsItemPageResDto response = new ContentsItemPageResDto(fileBoardResDtos, totalPages, filePurchaseStatus);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error occurred while processing request", e);
			return ResponseEntity.status(500).body(null);
		}
	}


	// 업로드한 자소서 내역 확인
	@GetMapping("/uploadedEnumPS")
	public List<FileBoardResDto> getUploadedPSItems(@RequestParam Long memberId,
											  @RequestParam("fileCategory") FileCategory fileCategory) {


//		log.info("Fetching purchased items for member ID: {} with fileCategory: {}", memberId, fileCategory);
		return fileBoardService.getUploadedData(memberId, fileCategory);
	}

	// 업로드한 생기부 내역 확인
	@GetMapping("/uploadedEnumSR")
	public List<FileBoardResDto> getUploadedSRItems(      @RequestParam Long memberId,
													@RequestParam("fileCategory") FileCategory fileCategory) {
//		log.info("Fetching purchased items for member ID: {} with fileCategory: {}", memberId, fileCategory);
		return fileBoardService.getUploadedData(memberId, fileCategory);
	}

	// 자료 업로드(저장)
	@PostMapping("/save")
	public ResponseEntity<String> saveFileBoard(
			@RequestParam("title") String title,
			@RequestParam("mainFile") MultipartFile mainFile,
			@RequestParam(value = "preview", required = false) MultipartFile preview,
			@RequestParam("folderPath") String folderPath,  // 파일 경로 받기
			@RequestParam(value = "summary", required = false) String summary,
			@RequestParam("univName") String univName,
			@RequestParam("univDept") String univDept,
			@RequestParam("price") int price,
			@RequestParam("fileCategory") FileCategory fileCategory,
			@RequestParam(value = "keywords", required = false) List<String> keywords,
			@RequestParam("memberId") Long memberId) { // 추가된 부분

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
				String previewName = preview.getOriginalFilename();
				System.out.println("Preview file: " + previewName);
			}

			if (summary == null || summary.trim().isEmpty()) {
				summary = ""; // 기본값 설정
			}

			if (keywords == null || keywords.isEmpty()) {
				keywords = List.of(); // 기본값 설정 (빈 리스트)
			}

			// memberId 출력 (디버깅 용도)
			System.out.println("Received memberId: " + memberId);

			// 서비스 호출
			fileBoardService.saveFileBoard(
					title, mainFile, preview, folderPath, summary, univName, univDept, price, fileCategory, keywords, memberId ); // memberId 추가
			return ResponseEntity.ok("파일 저장 성공");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
		}
	}

	@GetMapping("/download")
	public ResponseEntity<Resource> downloadFile(
			@RequestParam("fileUrl") String fileUrl,
			@RequestParam("fileName") String fileName) throws MalformedURLException {

		// Firebase URL을 Resource로 변환
		Resource resource = new UrlResource(fileUrl);

		if (!resource.exists() || !resource.isReadable()) {
			throw new RuntimeException("파일을 읽을 수 없거나 존재하지 않습니다: " + fileUrl);
		}

		// Firebase URL에서 실제 파일 이름만 추출 (경로와 파라미터 제거)
		String actualFileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1); // 마지막 '/' 이후 부분만 추출

		// 쿼리 파라미터 제거 (이미 쿼리 파라미터가 있는 경우)
		int queryParamIndex = actualFileName.indexOf('?');
		if (queryParamIndex != -1) {
			actualFileName = actualFileName.substring(0, queryParamIndex);
		}

		// 디버깅: 실제 파일 이름 출력
		log.warn("Extracted actual file name from URL: {}", actualFileName);

		// URL 디코딩
		String decodedFileName = null;
		try {
			decodedFileName = URLDecoder.decode(actualFileName, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("파일 이름 디코딩 실패", e);
		}

		// 디버깅: 디코딩된 파일 이름 출력
		log.warn("Decoded file name: {}", decodedFileName);

		// 실제 파일 이름만 추출 (이제 경로를 제외한 파일명만 남음)
		String fileNameOnly = decodedFileName.substring(decodedFileName.lastIndexOf("/") + 1);

		// 디버깅: 파일명만 출력
		log.warn("Cleaned file name: {}", fileNameOnly);

		// Content-Disposition 헤더 설정 전에 로그 출력
		String contentDisposition = "attachment; filename=\"" + fileNameOnly + "\"";
		log.warn("Setting Content-Disposition header with value: {}", contentDisposition);

		// HTTP 응답 헤더 설정 (파일 다운로드)
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
				.body(resource);
	}

}
