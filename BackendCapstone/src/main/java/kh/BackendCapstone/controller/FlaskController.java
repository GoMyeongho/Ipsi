package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.UnivReqDto;
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
	public ResponseEntity<List<Boolean>> univCsvUpload(@RequestBody List<UnivReqDto> univReqDtoList) {
		List<Boolean> resultList = new ArrayList<>();
		try {
			if (univReqDtoList == null || univReqDtoList.isEmpty()) {
				log.error("입력된 대학 데이터가 비어있습니다.");
				return ResponseEntity.badRequest().body(null); // 400 Bad Request
			}
			
			// Univ 데이터 저장
			for (UnivReqDto univReqDto : univReqDtoList) {
				try {
					Univ univ = new Univ();
					univ.setUnivName(univReqDto.getUnivName());
					univ.setUnivDept(univReqDto.getUnivDept());
					univ.setUnivImg(univReqDto.getUnivImg());
					
					boolean isSaved = univService.saveUniv(univ);
					resultList.add(isSaved);
					if (!isSaved) {
						log.error("대학 정보 저장 실패: UnivReqDto={} -> Univ={} (이유: 저장 실패)", univReqDto, univ);
					}
				} catch (Exception e) {
					log.error("대학 정보 처리 중 오류 발생: UnivReqDto={} (오류 메시지: {})", univReqDto, e.getMessage(), e);
					resultList.add(false);
				}
			}
			
			// 일부라도 실패했다면 로그를 남기고, 성공/실패 결과를 반환
			long failedCount = resultList.stream().filter(success -> !success).count();
			if (failedCount > 0) {
				log.error("{}개의 대학 정보 저장 실패", failedCount);
			}
			
			return ResponseEntity.ok(resultList);
			
		} catch (Exception e) {
			// 모든 예외를 포괄적으로 처리하고, 상세한 오류 메시지 기록
			log.error("대학 정보 입력 중 전체 오류 발생: {}", e.getMessage(), e);
			return ResponseEntity.status(500).body(null); // 500 Internal Server Error
		}
	}
}
