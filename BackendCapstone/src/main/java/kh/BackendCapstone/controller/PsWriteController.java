package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.PsContentsReqDto;
import kh.BackendCapstone.dto.request.PsWriteDto;
import kh.BackendCapstone.dto.request.PsWriteReqDto;
import kh.BackendCapstone.dto.response.PsWriteResDto;
import kh.BackendCapstone.service.PsWriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import retrofit2.http.Path;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/write")
public class PsWriteController {
    private final PsWriteService psWriteService;

/*    public PsWriteController(PsWriteService psWriteService) {
        this.psWriteService = psWriteService;
    }*/

    /*// 자기소개서 저장
    @PostMapping("/save/{memberId}")
    public ResponseEntity<PsWriteResDto> savePsWrite(
            @PathVariable Long memberId,
*//*            @RequestBody PsWriteReqDto psWriteReqDto,
            @RequestBody List<PsContentsReqDto> psContentsReqDtoList)*//*
            @RequestBody PsWriteDto psWriteDto) {
            log.info("Received memberId: " + memberId);  // 로그 추가

        try {
            PsWriteResDto psWriteResDto = psWriteService.savePsWrite(
                    memberId,
                    psWriteDto.getPsWriteReqDto(),
                    psWriteDto.getPsContentsReqDtoList()

            );
            return ResponseEntity.ok(psWriteResDto);
        } catch (Exception e) {
            log.error("컨트롤러_자기소개서 저장 실패", e);
//            return ResponseEntity.status(500).body(null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }*/

    @PostMapping("/save/{memberId}")
    public ResponseEntity<PsWriteResDto> savePsWrite(
            @RequestBody PsWriteReqDto psWriteReqDto,
            @RequestBody List<PsContentsReqDto> contentsReqDtoList) {
        try {
            log.info("Received request to save PsWrite: {}", psWriteReqDto);
            PsWriteResDto psWriteResDto = psWriteService.savePsWrite(psWriteReqDto, contentsReqDtoList);
            return ResponseEntity.ok(psWriteResDto);
        } catch (Exception e) {
            log.error("Failed to save PsWrite", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
