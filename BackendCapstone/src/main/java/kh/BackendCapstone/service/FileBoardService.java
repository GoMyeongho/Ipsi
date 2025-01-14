package kh.BackendCapstone.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.dto.response.FileBoardResDto;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.repository.FileBoardRepository;
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
	private final FileStorageService fileStorageService;
	private final UnivRepository univRepository;
	
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
//			log.warn("대학교 : {}, 학과 : {}, 에 대한 검색 결과 <{}> : {}",univName, univDept, page, fileBoardResDtoList);
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

	public void saveFileBoard(
			String title,
			MultipartFile mainFile,
			MultipartFile preview,
			String summary,
			int price,
			FileCategory fileCategory,
			String keywordsJson
			) throws Exception {

		// 파일 저장
		String mainFilePath = fileStorageService.saveFile(mainFile);
		String previewFilePath = fileStorageService.saveFile(preview);

		// 키워드 JSON 파싱
		List<String> keywords = new ObjectMapper().readValue(keywordsJson, new TypeReference<List<String>>() {});

		// 엔티티 생성
		FileBoard fileBoard = new FileBoard();
		fileBoard.setTitle(title);
		fileBoard.setMainFile(mainFilePath);
		fileBoard.setPreview(previewFilePath);
		fileBoard.setSummary(summary);
		fileBoard.setPrice(price);
		fileBoard.setFileCategory(fileCategory);
		fileBoard.setKeywords(keywords);

		// 연관 관계 처리
		Univ univ = new Univ();
		fileBoard.setUniv(univ);

		// DB 저장
		fileBoardRepository.save(fileBoard);
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
			fileBoardResDto.setPrice(fileBoard.getPrice());
			fileBoardResDto.setFileBoardId(fileBoard.getFileId());
			fileBoardResDto.setFileTitle(fileBoard.getTitle());
			fileBoardResDto.setFileCategory(fileBoard.getFileCategory());
			fileBoardResDto.setRegDate(fileBoard.getRegDate());
			fileBoardResDtoList.add(fileBoardResDto);
		}
		return fileBoardResDtoList;
	}
}
