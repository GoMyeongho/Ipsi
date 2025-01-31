package kh.BackendCapstone.service;

import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.PsContents;
import kh.BackendCapstone.entity.PsWrite;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.PsContentsRepository;
import kh.BackendCapstone.repository.PsWriteRepository;
import kh.BackendCapstone.dto.request.PsWriteReqDto;
import kh.BackendCapstone.dto.request.PsContentsReqDto;
import kh.BackendCapstone.dto.response.PsWriteResDto;
import kh.BackendCapstone.dto.response.PsContentsResDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PsWriteService {
    private final MemberRepository memberRepository;
    private final PsWriteRepository psWriteRepository;
    private final PsContentsRepository psContentsRepository;

    @Transactional
    public PsWriteResDto savePsWrite(PsWriteReqDto psWriteReqDto, List<PsContentsReqDto> contentsReqDtoList) {
        // 작성자 조회
        Member member = memberRepository.findById(psWriteReqDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));

        // 자기소개서 엔티티 생성
        PsWrite psWrite = new PsWrite();
        psWrite.setMember(member);
        psWrite.setPsName(psWriteReqDto.getPsName());
        psWrite.setRegDate(LocalDateTime.now());

        // 항목 리스트 저장
        List<PsContents> psContentsList = contentsReqDtoList.stream().map(contentDto -> {
            PsContents psContents = new PsContents();
            psContents.setPsWrite(psWrite);
            psContents.setPsTitle(contentDto.getPsTitle());
            psContents.setPsContent(contentDto.getPsContent());
            return psContents;
        }).collect(Collectors.toList());

        psWrite.setPsContents(psContentsList);

        // 저장
        PsWrite savedPsWrite = psWriteRepository.save(psWrite);

        // 저장된 데이터 DTO 변환 및 반환
        return convertToDto(savedPsWrite);
    }

    @Transactional
    public PsWriteResDto updatePsWrite(Long psWriteId, PsWriteReqDto psWriteReqDto, List<PsContentsReqDto> contentsReqDtoList) {
        // 기존 자기소개서 찾기
        PsWrite psWrite = psWriteRepository.findById(psWriteId)
                .orElseThrow(() -> new IllegalArgumentException("해당 자기소개서가 존재하지 않습니다."));

        // 자기소개서 이름이 변경되었으면 업데이트
        if (!psWrite.getPsName().equals(psWriteReqDto.getPsName())) {
            psWrite.setPsName(psWriteReqDto.getPsName());
        }

        // 기존 항목들을 업데이트
        List<PsContents> psContentsList = psContentsRepository.findByPsWrite(psWrite);
        Map<Long, PsContents> contentMap = psContentsList.stream()
                .collect(Collectors.toMap(PsContents::getPsContentsId, content -> content));

        for (PsContentsReqDto contentDto : contentsReqDtoList) {
            PsContents existingContent = contentMap.get(contentDto.getPsContentsId());
            if (existingContent != null) {
                // 항목 제목 및 내용을 비교하여 변경된 경우만 업데이트
                if (!existingContent.getPsTitle().equals(contentDto.getPsTitle())) {
                    existingContent.setPsTitle(contentDto.getPsTitle());
                }
                if (!existingContent.getPsContent().equals(contentDto.getPsContent())) {
                    existingContent.setPsContent(contentDto.getPsContent());
                }
            }
        }

        // 저장된 데이터 DTO 변환 및 반환
        PsWrite savedPsWrite = psWriteRepository.save(psWrite);
        return convertToDto(savedPsWrite);
    }

    // PsWrite 엔티티 PsWriteResDto 변환
    private PsWriteResDto convertToDto(PsWrite psWrite) {
        List<PsContentsResDto> contentsResDtos = psWrite.getPsContents().stream()
                .map(content -> new PsContentsResDto(content.getPsContentsId(), content.getPsTitle(), content.getPsContent()))
                .collect(Collectors.toList());

        return PsWriteResDto.builder()
                .psWriteId(psWrite.getPsWriteId())
                .memberId(psWrite.getMember().getMemberId())
                .psName(psWrite.getPsName())
                .regDate(psWrite.getRegDate())
                .psContents(contentsResDtos)
                .build();
    }
}