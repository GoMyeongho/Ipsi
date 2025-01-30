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

    /*// 자기소개서 DB 저장
    @Transactional
    public PsWriteResDto savePsWrite(PsWriteReqDto psWriteReqDto, List<PsContentsReqDto> psContentsReqDtoList) {
        // 작성자 가져오기
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));

        // 자기소개서 저장
        PsWrite psWrite = new PsWrite();
//        psWrite.setMember(member);
        psWrite.setPsName(psWriteReqDto.getPsName());
        psWrite.setRegDate(LocalDateTime.now()); // 현재 시간으로 생성일 설정
        psWrite = psWriteRepository.save(psWrite); // PsWrite 저장 후 ID 반환

        // 자기소개서 항목 저장
        List<PsContents> psContentsList = psContentsReqDtoList.stream().map(psContentsReqDto -> {
            PsContents psContents = new PsContents();
            psContents.setPsTitle(psContentsReqDto.getPsTitle());
            psContents.setPsContent(psContentsReqDto.getPsContent());
            return psContents;
        }).collect(Collectors.toList());

        psContentsRepository.saveAll(psContentsList);

        // PsWrite 엔티티 Dto로 변환
        PsWriteResDto psWriteResDto = new PsWriteResDto();
        psWriteResDto.setPsWriteId(psWrite.getPsWriteId());
        psWriteResDto.setMemberId(psWrite.getMember().getMemberId());
        psWriteResDto.setPsName(psWrite.getPsName());
        psWriteResDto.setRegDate(psWrite.getRegDate());

        // PsContentsResDto 리스트 생성
        List<PsContentsResDto> psContentsResDtoList = psContentsList.stream().map(psContents -> {
            PsContentsResDto psContentsResDto = new PsContentsResDto();
            psContentsResDto.setPsContentsId(psContents.getPsContentsId());
            psContentsResDto.setPsTitle(psContents.getPsTitle());
            psContentsResDto.setPsContent(psContents.getPsContent());
            return psContentsResDto;
        }).collect(Collectors.toList());

        psWriteResDto.setPsContents(psContentsResDtoList);

        return psWriteResDto;
    }*/


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