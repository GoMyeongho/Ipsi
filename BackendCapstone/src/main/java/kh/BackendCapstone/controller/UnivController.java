package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.response.UnivResDto;
import kh.BackendCapstone.service.UnivService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/univ")
@Slf4j
public class UnivController {
    private final UnivService univService;


    // 전체 대학 조회
    @GetMapping("/allSearch")
    public ResponseEntity<List<UnivResDto>> getAllUniversities() {
        try {
            List<UnivResDto> univList = univService.allUniv();
            return ResponseEntity.ok(univList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 예외 처리
        }
    }

    // 특정 대학 상세 조회
    @GetMapping("/universities/{univId}")
    public ResponseEntity<List<UnivResDto>> getUniversityDetails(@PathVariable Long univId) {
        try {
            List<UnivResDto> univDetails = univService.getUnivDetails(univId);
            return ResponseEntity.ok(univDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 예외 처리
        }
    }
}
