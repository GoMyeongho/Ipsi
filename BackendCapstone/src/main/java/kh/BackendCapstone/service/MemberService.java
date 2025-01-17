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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
		return convertTokenToEntity(token).getAuthority().equals(Authority.fromString(role));
	}
	
	// 토큰에서 Member 객체를 받아오는 메서드( 클래스 외부에서도 불러올 수 있게 public )
	public Member convertTokenToEntity(String token) {
		// 토큰 앞에 있는 "Bearer " 제거
		token = token.replace("Bearer ", "");
		// token 을 통해 memberId를 담고 있는 객체 Authentication 을 불러옴
		Authentication authentication = tokenProvider.getAuthentication(token);
		log.warn("Authentication 의 형태 : {}", authentication);
		// Name 은 String 으로 되어 있기 때문에 Long으로 바꿔주는 과정이 있어야 타입이 일치
		Long id = Long.parseLong(authentication.getName());
		Member member = memberRepository.findById(id)
			.orElseThrow(()-> new RuntimeException("존재 하지 않는 memberId 입니다."));

		// 이메일을 반환하여 클라이언트에서 처리하도록 함
		String email = member.getEmail();
		String nickName = member.getNickName();
//		String profile = member.getProfile();
		log.warn("토큰으로부터 얻은 이메일: {}", email);
		log.warn("토큰으로부터 얻은 닉네임: {}", nickName);
		log.warn("토큰으로부터 얻은 Member: {}", member);
		return member;
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