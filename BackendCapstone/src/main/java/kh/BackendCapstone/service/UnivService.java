package kh.BackendCapstone.service;


import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.repository.FileBoardRepository;
import kh.BackendCapstone.repository.UnivRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;


@Service
@Slf4j
@RequiredArgsConstructor
public class UnivService {
	private  final UnivRepository univRepository;
	private final FileBoardRepository fileBoardRepository;

	// Service(에서) 데이터 로딩
	public List<Map<String, Object>> getDropDownList() {
		try {
			// 모든 대학 조회
			List<Univ> univList = univRepository.findAll();
			List<Map<String, Object>> dropdownList = new ArrayList<>(); // List로 선언
			
			// 대학별 학과 리스트 생성
			for (Univ univ : univList) {
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
