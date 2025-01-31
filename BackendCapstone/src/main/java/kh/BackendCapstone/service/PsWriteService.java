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
            psContents.setSectionsNum(contentDto.getSectionsNum());
            return psContents;
        }).collect(Collectors.toList());

        psWrite.setPsContents(psContentsList);

        // 저장
        PsWrite savedPsWrite = psWriteRepository.save(psWrite);

        // 저장된 데이터 DTO 변환 및 반환
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