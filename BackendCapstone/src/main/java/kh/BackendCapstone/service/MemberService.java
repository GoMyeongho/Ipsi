package kh.BackendCapstone.service;



import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.dto.request.MemberReqDto;
import kh.BackendCapstone.dto.response.MemberResDto;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.jwt.TokenProvider;
import kh.BackendCapstone.repository.MemberRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor // 생성자를 통한 의존성 주입을 받기 위해서 모든
public class MemberService {
	private MemberRepository memberRepository;
	private TokenProvider tokenProvider;
	
	// 전체 회원 조회
	public List<MemberResDto> allMember() {
		try {
			List<Member> members = memberRepository.findAll();
			// 프론트 엔드에 정보를 전달하기 위해 DTO List 를 생성
			List<MemberResDto> memberResDtoList = new ArrayList<>();
			for (Member member : members) {
				memberResDtoList.add(convertEntityToDto(member));
			}
			return memberResDtoList;
		} catch (Exception e) {
			log.error("전체 조회 실패 : {}", e.getMessage());
			return null;
		}
	}
	
	// 특정 회원 조회
	public MemberResDto findMember(String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
		return convertEntityToDto(member);
	}
	
	// 회원 정보 수정
	public boolean updateMember(MemberReqDto memberReqDto) {
		try {
			Member member = memberRepository.findByEmail(memberReqDto.getEmail())
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			member.setName(memberReqDto.getName());
			memberRepository.save(member);
			return true;
		} catch (Exception e) {
			log.error("회원 정보 수정중 오류 : {}", e.getMessage());
			return false;
		}
	}
	public boolean deleteMember(String email) {
		try {
			Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			memberRepository.delete(member);
			return true;
		} catch (Exception e) {
			log.error("회원 삭제에 실패 했습니다 : {}", e.getMessage());
			return false;
		}
	}
	
	public boolean isRole(String role, String token) {
		token = token.replace("Bearer ", "");
		Authentication authentication = tokenProvider.getAuthentication(token);
		Long id = Long.parseLong(authentication.getName());
		Member member = memberRepository.findById(id)
			.orElseThrow(()-> new RuntimeException("존재 하지 않는 이메일입니다."));
		return member.getAuthority().equals(Authority.fromString(role));
	}
	
	// Member Entity -> 회원 정보 DTO
	private MemberResDto convertEntityToDto(Member member) {
		MemberResDto memberResDto = new MemberResDto();
		memberResDto.setEmail(member.getEmail());
		memberResDto.setName(member.getName());
//		memberResDto.setRegDate(member.getRegDate());
//		memberResDto.setPhone(m)
		memberResDto.setRegDate(member.getRegDate());
		return memberResDto;
	}
	
}
