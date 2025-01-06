package kh.BackendCapstone.controller;

import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.service.UnivService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5000")
@RequestMapping("/flask")
@Slf4j
public class FlaskController {
	private final UnivService univService;
	
	// 대학 정보 업로드 API
	@Transactional
	@PostMapping("/univ")
	public ResponseEntity<List<Boolean>> univCsvUpload(@RequestBody List<Univ> univList) {
		List<Boolean> resultList = new ArrayList<>();
		try {
			// Univ 데이터 저장
			for (Univ univ : univList) {
				boolean isSaved = univService.saveUniv(univ);
				resultList.add(isSaved);
				if (!isSaved) {
					log.error("대학 정보 저장 실패: {}", univ.getUnivName());
				}
			}
			// 모든 데이터 저장 성공 시
			return ResponseEntity.ok(resultList);
		} catch (Exception e) {
			// 예외 처리 및 로그 기록
			log.error("대학 정보 입력 중 오류 발생: {}", e.getMessage());
			return ResponseEntity.status(500).body(null); // 500 Internal Server Error
		}
	}
}
