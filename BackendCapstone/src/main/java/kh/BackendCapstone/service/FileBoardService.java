package kh.BackendCapstone.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.dto.response.FileBoardResDto;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.repository.FileBoardRepository;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.UnivRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service @Slf4j
@RequiredArgsConstructor
public class FileBoardService {
	private final FileBoardRepository fileBoardRepository;
	private final FirebaseUploadService firebaseUploadService;
	private final UnivRepository univRepository;
	private final MemberRepository memberRepository;
	
	public int getPageSize(int limit, String univName, String univDept, String category) {
		Pageable pageable = PageRequest.of(0, limit);
		try{
			Page<FileBoard> page = selectOption(univName, univDept, pageable, category);
			return page.getTotalPages();
		} catch (Exception e) {
			log.error("대학 : {} , 학과 : {} 에 대한 페이지 검색중 에러 : {}", univName, univDept, e.getMessage());
			return 0;
		}
	}
	
	// 페이지네이션 및 필터링 처리
	public List<FileBoardResDto> getContents(int page, int limit, String univName, String univDept, String category) {
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("univ.univName").ascending());
		try {
			Page<FileBoard> fileBoardPage = selectOption(univName, univDept, pageable, category);
			List<FileBoardResDto> fileBoardResDtoList = convertEntityToDto(fileBoardPage.getContent());
			return fileBoardResDtoList;
		} catch (Exception e) {
			log.error("전체 조회 실패 : {}", e.getMessage());
			throw new RuntimeException("데이터 조회 실패: " + e.getMessage());
		}
	}

	private Page<FileBoard> selectOption(String univName, String univDept, Pageable pageable, String category) {
//		log.warn("Query Params -> univName: {}, univDept: {}, category: {}", univName, univDept, category);

		if (univName == null || univName.isEmpty()) {
			return fileBoardRepository.findAllByFileCategory(FileCategory.fromString(category), pageable);
		}

		if (univDept == null || univDept.isEmpty()) {
			return fileBoardRepository.findAllByUniv_UnivNameAndFileCategory(univName, FileCategory.fromString(category), pageable);
		}

		// 다중 Univ 결과 처리
		List<Univ> univList = univRepository.findAllByUnivNameAndUnivDept(univName, univDept);
		if (univList.isEmpty()) {
			throw new RuntimeException("해당 조건에 맞는 대학 정보가 없습니다.");
		}

		// Univ 리스트를 기반으로 검색
		return fileBoardRepository.findAllByUnivInAndFileCategory(univList, FileCategory.fromString(category), pageable);
	}

	public List<FileBoardResDto> getUploadedData(Long memberId, FileCategory fileCategory) {
		// 파일 카테고리와 회원 ID를 기준으로 업로드된 파일들을 조회합니다.
		List<FileBoard> fileBoards = fileBoardRepository.findByMember_MemberIdAndFileCategory(memberId, fileCategory);

		// 조회된 파일 데이터를 DTO로 변환하여 반환
		return fileBoards.stream().map(fileBoard -> new FileBoardResDto(
				fileBoard.getUniv().getUnivName(), // 대학 이름
				fileBoard.getUniv().getUnivDept(), // 대학 전공(학과)
				fileBoard.getTitle(),
				fileBoard.getPrice(), // 파일 금액
				fileBoard.getRegDate() // 업로드 날짜
		)).collect(Collectors.toList());
	}

	// 자소서,생기부 관련 업로드
	public void saveFileBoard(
			String title,
			MultipartFile mainFile,
			MultipartFile preview,
			String folderPath,
			String summary,
			String univName,
			String univDept,
			int price,
			FileCategory fileCategory,
			List<String> keywords,
			Long memberId // 추가된 파라미터
	) throws Exception {
		// mainFile을 Firebase로 업로드하고, Firebase에서 반환된 파일 경로를 사용
		String mainFilePath = firebaseUploadService.handleFileUpload(mainFile, folderPath); // Firebase로 파일 업로드
		// preview 파일이 존재하면 Firebase로 업로드
		String previewFilePath = (preview != null && !preview.isEmpty()) ? firebaseUploadService.handleFileUpload(preview, folderPath) : null;
		mainFilePath = convertJSONToPath(mainFilePath);
		previewFilePath = convertJSONToPath(previewFilePath);
		try {
			// 엔티티 생성;
			FileBoard fileBoard = new FileBoard();
			fileBoard.setTitle(title);
			fileBoard.setMainFile(mainFilePath);
			fileBoard.setPreview(previewFilePath); // preview 파일 경로도 저장
			fileBoard.setSummary(summary);
			fileBoard.setPrice(price);
			fileBoard.setFileCategory(fileCategory);
			fileBoard.setKeywords(String.join(", ", keywords)); // List<String>을 문자열로 변환하여 저장

			// 대학 정보 조회
			Univ univ = univRepository.findByUnivNameAndUnivDept(univName, univDept);
			if (univ == null) {
				throw new IllegalArgumentException("해당 대학 정보가 존재하지 않습니다: " + univName + ", " + univDept);
			}
			fileBoard.setUniv(univ);

			// Member 정보 조회
			Member member = memberRepository.findById(memberId)
					.orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다: ID = " + memberId));
			fileBoard.setMember(member);

			// DB 저장
			fileBoardRepository.save(fileBoard);
		} catch (Exception e) {
			log.error("JSON 변환중 오류 : {}",e.getMessage());
		}
	}

	private List<FileBoardResDto> convertEntityToDto(List<FileBoard> fileBoardList) {
		List<FileBoardResDto> fileBoardResDtoList = new ArrayList<>();
		for (FileBoard fileBoard : fileBoardList) {
			FileBoardResDto fileBoardResDto = new FileBoardResDto();
			fileBoardResDto.setUnivId(fileBoard.getUniv().getUnivId());
			fileBoardResDto.setUnivName(fileBoard.getUniv().getUnivName());
			fileBoardResDto.setUnivDept(fileBoard.getUniv().getUnivDept());
			fileBoardResDto.setUnivImg(fileBoard.getUniv().getUnivImg());
			fileBoardResDto.setMemberId(fileBoard.getMember().getMemberId());
			fileBoardResDto.setMemberName(fileBoard.getMember().getName());
			fileBoardResDto.setMemberEmail(fileBoard.getMember().getEmail());
			fileBoardResDto.setSummary(fileBoard.getSummary());
			fileBoardResDto.setKeywords(fileBoard.getKeywords());
			fileBoardResDto.setMainFile(fileBoard.getMainFile());
			fileBoardResDto.setPreview(fileBoard.getPreview());
			fileBoardResDto.setPrice(fileBoard.getPrice());
			fileBoardResDto.setFileBoardId(fileBoard.getFileId());
			fileBoardResDto.setFileTitle(fileBoard.getTitle());
			fileBoardResDto.setFileCategory(fileBoard.getFileCategory());
			fileBoardResDto.setRegDate(fileBoard.getRegDate());
			fileBoardResDtoList.add(fileBoardResDto);
		}
		return fileBoardResDtoList;
	}
	private String convertJSONToPath(String json) {
		// ObjectMapper 생성
		try	{
			ObjectMapper objectMapper = new ObjectMapper();

			// JSON 문자열을 JsonNode로 변환
			JsonNode rootNode = objectMapper.readTree(json);

			// 특정 값 추출
			String url = rootNode.get("url").asText();
			String message = rootNode.get("message").asText();

			// 값 출력

			System.out.println("URL: " + url);
			System.out.println("Message: " + message);
			return url;
		} catch (Exception e) {
			log.error("error : {}",e.getMessage());
			return "";
		}
	}
}
