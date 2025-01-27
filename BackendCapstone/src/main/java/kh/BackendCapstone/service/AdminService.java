package kh.BackendCapstone.service;


import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.dto.response.PermissionResDto;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Permission;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.PermissionRepository;
import kh.BackendCapstone.repository.UnivRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {
	private final PermissionRepository permissionRepository;
	private final UnivRepository univRepository;
	private final MemberRepository memberRepository;
	
	public PermissionResDto getPermission(Long id) {
		try {
			Permission permission = permissionRepository.findByPermissionId(id)
				.orElseThrow(() -> new RuntimeException("해당 권한 설정이 없습니다."));
			log.warn("권한 설정 : {}", permission);
			return convertEntityToDto(permission);
		} catch (Exception e) {
			log.error("권한 불러오는 중 에러 발생 : {}", e.getMessage());
			return null;
		}
	}
	
	public List<PermissionResDto> getPermissionList(String active) {
		try{
			List<Permission> permissionList = permissionRepository.findAllByActive(Active.fromString(active));
			log.warn("{}개의 상태가 {}인 권한 설정 목록 : {}",permissionList.size(), active, permissionList);
			return convertEntityToDtoList(permissionList);
		} catch (Exception e) {
			log.error("권한 리스트 불러오는 중 에러 발생 : {}", e.getMessage());
			return null;
		}
	}
	
	
	@Transactional
	public boolean activatePermission(Long permissionId, Long univId, boolean isUniv) {
		try{
			Permission permission = permissionRepository.findByPermissionId(permissionId)
				.orElseThrow(() -> new RuntimeException("해당 권한 설정이 없습니다."));
			Univ univ = univRepository.findById(univId)
				.orElseThrow(() -> new RuntimeException("해당 대학이 존재하지 않습니다."));
			permission.setActive(Active.ACTIVE);
			permission.setActiveDate(LocalDateTime.now());
			permission.setUniv(univ);
			if (isUniv) {
				Member member = permission.getMember();
				member.setUniv(univ);
				memberRepository.save(member);
			}
			log.warn("권한 설정 변경 : {}", permission);
			return permissionSave(permission);
		} catch (Exception e) {
			log.error("권한 변경중 에러 : {}", e.getMessage());
			return false;
		}
	}
	
	public boolean permissionSave(Permission permission) {
		try {
			Permission savedPermission = permissionRepository.save(permission);
			// 저장된 Permission이 null이 아니면 성공
			return savedPermission.getPermissionId() != null;
		} catch (Exception e) {
			// 저장 중 예외가 발생하면 false 반환
			log.error("저장중 에러 : {}",e.getMessage());
			return false;
		}
	}
	
	public List<String> getUnivList() {
		try {
			List<String> univList = univRepository.findDistinctColumn();
			log.warn("대학 이름 전체 조회 결과 : {}", univList);
			return univList;
		} catch (Exception e) {
			log.error("전체 대학 조회중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	public List<Univ> getDeptList(String univName) {
		try {
			List<Univ> univList = univRepository.findByUnivName(univName);
			log.warn("학과 조회 결과 : {}", univList);
			return univList;
		} catch (Exception e) {
			log.error("학과 조회중 오류 : {}", e.getMessage());
			return null;
		}
	}
	
	public PermissionResDto convertEntityToDto(Permission permission) {
		PermissionResDto dto = new PermissionResDto();
		dto.setPermissionId(permission.getPermissionId());
		dto.setUnivName(permission.getUniv().getUnivName());
		dto.setUnivDept(permission.getUniv().getUnivDept());
		dto.setMemberId(permission.getMember().getMemberId());
		dto.setName(permission.getMember().getName());
		dto.setNickname(permission.getMember().getNickName());
		dto.setAuthority(permission.getMember().getAuthority());
		dto.setActive(permission.getActive());
		dto.setPermissionUrl(permission.getPermissionUrl());
		dto.setRegDate(permission.getRegDate());
		dto.setActiveDate(permission.getActiveDate());
		return dto;
	}
	
	
	public List<PermissionResDto> convertEntityToDtoList(List<Permission> permissionList) {
		List<PermissionResDto> dtoList = new ArrayList<>();
		for (Permission permission : permissionList) {
			PermissionResDto dto = new PermissionResDto();
			dto.setActive(permission.getActive());
			dto.setUnivName(permission.getUniv().getUnivName());
			dto.setUnivDept(permission.getUniv().getUnivDept());
			dto.setNickname(permission.getMember().getNickName());
			dto.setMemberId(permission.getMember().getMemberId());
			dto.setPermissionId(permission.getPermissionId());
			dto.setAuthority(permission.getMember().getAuthority());
			dto.setRegDate(permission.getRegDate());
			dto.setActiveDate(permission.getActiveDate());
			dtoList.add(dto);
		}
		return dtoList;
	}
}
