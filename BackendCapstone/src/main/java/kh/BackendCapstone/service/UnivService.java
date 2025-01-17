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


	// 모든 대학 목록 조회
	public List<Map<String, Object>> getUnivList() {
		try {
			// 대학 목록 조회
			List<Univ> univList = univRepository.findAll();
			List<Map<String, Object>> univListResponse = new ArrayList<>();

			for (Univ univ : univList) {
				Map<String, Object> univMap = new HashMap<>();
				univMap.put("univName", univ.getUnivName());
				univListResponse.add(univMap);
			}
			return univListResponse;
		} catch (Exception e) {
			log.error("대학 목록 조회 실패: {}", e.getMessage(), e);
			throw new RuntimeException("대학 목록을 조회하는 중 문제가 발생했습니다.");
		}
	}

	// 특정 대학에 대한 학과 목록 조회
	public List<Map<String, Object>> getDeptList(String univName) {
		try {
			// 해당 대학 조회 (여러 개일 수 있음)
			List<Univ> univList = univRepository.findByUnivName(univName);

			if (univList.isEmpty()) {
				throw new RuntimeException("대학 정보를 찾을 수 없습니다: " + univName);
			}

			// 모든 대학에 대해 학과 목록 생성
			List<Map<String, Object>> deptListResponse = new ArrayList<>();

			// 각 대학에 대해 학과 목록 생성
			for (Univ univ : univList) {
				String[] departments = univ.getUnivDept().split(","); // 쉼표로 구분된 학과 문자열 분리

				for (String dept : departments) {
					Map<String, Object> deptMap = new HashMap<>();
					deptMap.put("deptName", dept.trim()); // 공백 제거 후 학과 이름 추가
					deptListResponse.add(deptMap);
				}
			}

			return deptListResponse;

		} catch (Exception e) {
			log.error("학과 목록 조회 실패: 대학명 = {}, 에러 = {}", univName, e.getMessage(), e);
			throw new RuntimeException("학과 목록을 조회하는 중 문제가 발생했습니다.", e);
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
