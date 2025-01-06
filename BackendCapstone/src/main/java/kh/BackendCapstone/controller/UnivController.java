package kh.BackendCapstone.controller;


import kh.BackendCapstone.dto.response.UnivResDto;
import kh.BackendCapstone.service.UnivService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/univ")
@Slf4j
public class UnivController {
    private final UnivService univService;

    // 드롭다운 조회
    @GetMapping("/dropDownList")
    public ResponseEntity<List<Map<String, Object>>> getDropDownList() {
        try {
            List<Map<String, Object>> dropdownList = univService.getDropDownList();
            // 컨트롤러에서 데이터를 추가로 로그에 남기고 싶다면 여기에 추가
            log.info("Dropdown Response Data: {}", dropdownList);
            return ResponseEntity.ok(dropdownList);
        } catch (Exception e) {
            log.error("드롭다운 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // 전체 자소서 조회
    @GetMapping("/contents")
    public ResponseEntity<List<UnivResDto>> getAllUniversities() {
        try {
            List<UnivResDto> univList = univService.allUniv();
            return ResponseEntity.ok(univList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 예외 처리
        }
    }

//    // 특정 대학 상세 조회
//    @GetMapping("/universities/{univId}")
//    public ResponseEntity<List<UnivResDto>> getUniversityDetails(@PathVariable Long univId) {
//        try {
//            List<UnivResDto> univDetails = univService.getUnivDetails(univId);
//            return ResponseEntity.ok(univDetails);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(null); // 예외 처리
//        }
//    }
}
