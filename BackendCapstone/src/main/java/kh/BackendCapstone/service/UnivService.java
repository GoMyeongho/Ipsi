package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.response.UnivResDto;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.repository.FileBoardRepository;
import kh.BackendCapstone.repository.UnivRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class UnivService {
	private final UnivRepository univRepository;
	private final FileBoardRepository fileBoardRepository;
	
	// Service(에서) 데이터 로딩
	public List<Map<String, Object>> getDropDownList() {
		try {
			// 모든 대학 조회
			List<Univ> univs = univRepository.findAll();
			List<Map<String, Object>> dropdownList = new ArrayList<>(); // List로 선언
			
			// 대학별 학과 리스트 생성
			for (Univ univ : univs) {
				Map<String, Object> entry = new HashMap<>();
				entry.put("univName", univ.getUnivName());
				entry.put("departments", Arrays.asList(univ.getUnivDept().split(","))); // 학과 분리
				dropdownList.add(entry); // List에 추가
			}
			return dropdownList;
		} catch (Exception e) {
			log.error("드롭다운 리스트 조회 실패: {}", e.getMessage(), e);
			throw new RuntimeException("드롭다운 리스트를 조회하는 중 문제가 발생했습니다.");
		}
	}
	
	public List<UnivResDto> allUniv() {
		try {
			List<Univ> univs = univRepository.findAll();
			
			List<UnivResDto> univResDtoList = new ArrayList<>();
			
			for (Univ univ : univs) {
				// 해당 대학과 관련된 파일보드 데이터 가져오기
				List<FileBoard> fileBoards = fileBoardRepository.findByUniv(univ); // Univ 객체를 전달
				
				for (FileBoard fileBoard : fileBoards) {
					String memberName = fileBoard.getMember() != null ? fileBoard.getMember().getName() : "Unknown";
					
					UnivResDto dto = new UnivResDto(
						univ.getUnivName(),
						univ.getUnivDept(),
						univ.getUnivImg(),
						fileBoard.getPrice(),
						memberName
					);
					univResDtoList.add(dto);
				}
			}
			return univResDtoList;
			
		} catch (Exception e) {
			log.error("전체 조회 실패 : {}", e.getMessage());
			return null;
		}
	}
	public boolean saveUniv(Univ univ) {
		try{
			univRepository.save(univ);
			return true;
		} catch(Exception e){
			log.error("대학 정보저장중 오류 : {}",e.getMessage());
			return false;
		}
	}
}
