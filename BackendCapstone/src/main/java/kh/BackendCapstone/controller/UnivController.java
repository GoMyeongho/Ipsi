package kh.BackendCapstone.controller;



import kh.BackendCapstone.service.UnivService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j // 로깅 기능 추가
@RequiredArgsConstructor // final 필드와 @NonNull 필드에 대해 생성자를 자동으로 생성
@RestController // 해당 클래스가 RESTful 웹 서비스를 처리하는 컨트롤러임을 나타냄, 모든 메서드의 반환 값은 자동으로 JSON 형태로 변환되어 HTTP 응답 본문에 포함됨
@RequestMapping("/univ") // HTTP 요청의 URL(을) 특정 클래스나 메서드와 매핑
@CrossOrigin(origins = "http://localhost:3000") // CORS(Cross-Origin Resource Sharing)**를 설정, 이 경우 http://localhost:3000에서 오는 요청을 허용

public class UnivController {
    private final UnivService univService;

    // 드롭다운 조회
    @GetMapping("/dropDownList")
    public ResponseEntity<List<Map<String, Object>>> getDropDownList() {
        try {
            List<Map<String, Object>> dropdownList = univService.getDropDownList();
            // 컨트롤러에서 데이터를 추가로 로그에 남기고 싶다면 여기에 추가
//            log.info("Dropdown Response Data: {}", dropdownList);
            return ResponseEntity.ok(dropdownList);
        } catch (Exception e) {
            log.error("드롭다운 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 대학 목록 조회 (추가된 메서드)
    @GetMapping("/univList")
    public ResponseEntity<List<Map<String, Object>>> getUnivList() {
        try {
            List<Map<String, Object>> univList = univService.getUnivList();
//            log.info("Univ List Response Data: {}", univList);
            return ResponseEntity.ok(univList);
        } catch (Exception e) {
            log.error("대학 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 학과 목록 조회 (추가된 메서드)
    @GetMapping("/deptList")
    public ResponseEntity<List<Map<String, Object>>> getDeptList(@RequestParam String univName) {
        try {
            List<Map<String, Object>> deptList = univService.getDeptList(univName);
//            log.info("Dept List for University {}: {}", univName, deptList);
            return ResponseEntity.ok(deptList);
        } catch (Exception e) {
            log.error("학과 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    

}
