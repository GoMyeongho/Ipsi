package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.PsContentsReqDto;
import kh.BackendCapstone.dto.request.PsWriteDto;
import kh.BackendCapstone.dto.request.PsWriteReqDto;
import kh.BackendCapstone.dto.response.PsContentsResDto;
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

    @PostMapping("/save/{memberId}")
    public ResponseEntity<PsWriteResDto> savePsWrite(@RequestBody PsWriteDto psWriteDto) {
        try {
            // psWriteDto에서 PsWriteReqDto와 List<PsContentsReqDto> 추출
            PsWriteReqDto psWriteReqDto = psWriteDto.getPsWriteReqDto();
            List<PsContentsReqDto> contentsReqDtoList = psWriteDto.getPsContentsReqDtoList();

            log.info("Received request to save PsWrite: {}", psWriteReqDto);

            // 서비스 호출
            PsWriteResDto psWriteResDto = psWriteService.savePsWrite(psWriteReqDto, contentsReqDtoList);
            return ResponseEntity.ok(psWriteResDto);
        } catch (Exception e) {
            log.error("Failed to save PsWrite", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
