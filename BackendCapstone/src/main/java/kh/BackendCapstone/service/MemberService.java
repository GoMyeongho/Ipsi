package kh.BackendCapstone.service;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.dto.request.MemberReqDto;
import kh.BackendCapstone.dto.response.MemberPermissionResDto;
import kh.BackendCapstone.dto.response.MemberResDto;
import kh.BackendCapstone.dto.response.PermissionResDto;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Permission;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.entity.UserBank;
import kh.BackendCapstone.jwt.TokenProvider;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.PermissionRepository;
import kh.BackendCapstone.repository.UserBankRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@Service
@AllArgsConstructor // 생성자를 통한 의존성 주입을 받기 위해서 모든
public class MemberService {
	private MemberRepository memberRepository;
	private TokenProvider tokenProvider;
	private PasswordEncoder passwordEncoder;
	private final HttpServletRequest request;
	private PermissionRepository permissionRepository;
	private UserBankRepository userBankRepository;

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
	public MemberResDto findMemberByEmail(String email) {
		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
		return convertEntityToDto(member);
	}

	public MemberResDto findEmailByPhone(String phone) {
		Member member = memberRepository.findEmailByPhone(phone)
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
		return convertEntityToDto(member);
	}

	public boolean checkPassword(String token, String password) {
		Long memberId = getMemberId(token);
		System.out.println(password);
		System.out.println(memberId);
		request.getSession().setAttribute("memberId", memberId);
		Optional<Member> memberOptional = memberRepository.findById(memberId);  // 이메일로 회원 조회

		if (memberOptional.isPresent()) {
			Member member = memberOptional.get();
			// 입력된 평문 비밀번호와 DB에 저장된 암호화된 비밀번호 비교
			return passwordEncoder.matches(password, member.getPwd());
		}

		return false;  // 이메일이 존재하지 않으면 false 반환
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

	public String getRole(String token) {
		return convertTokenToEntity(token).getAuthority().toString();
	}
	public long getMemberId(String token) {
		try {
			Member member = convertTokenToEntity(token);
			return member.getMemberId(); // memberId 반환
		} catch (Exception e) {
			// 예외 로깅
			e.printStackTrace();
			throw new RuntimeException("수익금 가져오기 실패", e);
		}
	}
	public void saveRevenue(Long profit, String token) {
		try {
			// 토큰에서 memberId 추출
			Long memberId = getMemberId(token);

			// 해당 memberId로 Member 조회
			Member member = memberRepository.findById(memberId)
					.orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

			// 출금 가능한 금액인지 확인
			if (member.getRevenue() < profit) {
				throw new RuntimeException("출금 가능한 금액을 초과했습니다.");
			}

			// revenue 갱신
			int newRevenue = (int) (member.getRevenue() - profit); // 타입 캐스팅
			member.setRevenue(newRevenue);
			memberRepository.save(member); // 변경된 member 저장

			// UserBank 엔티티에 연결된 bank 정보 저장
			UserBank userBank = userBankRepository.findByMember_MemberId(memberId)
					.orElseThrow(() -> new RuntimeException("연결된 계좌 정보가 없습니다."));

			// withdrawal 필드에 출금 금액 누적 (기존 값에 추가)
			Long currentWithdrawal = userBank.getWithdrawal() != null ? userBank.getWithdrawal() : 0L;
			userBank.setWithdrawal(currentWithdrawal + profit);
			userBankRepository.save(userBank);
		} catch (Exception e) {
			// 예외 처리
			e.printStackTrace();
			throw new RuntimeException("수익금 저장 실패: " + e.getMessage(), e);
		}
	}
	public int getRevenue(String token) {
		try {
			return convertTokenToEntity(token).getRevenue();
		} catch (Exception e) {
			// 예외 로깅
			e.printStackTrace();
			throw new RuntimeException("수익금 가져오기 실패", e);
		}
	}

	// 토큰에서 Member 객체를 받아오는 메서드( 클래스 외부에서도 불러올 수 있게 public )
	public Member convertTokenToEntity(String token) {
		try{
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
			Long memberId = member.getMemberId();
			log.warn("토큰으로부터 얻은 이메일: {}", email);
			log.warn("토큰으로부터 얻은 닉네임: {}", nickName);
			log.warn("토큰으로부터 얻은 멤버아이디: {}", memberId);
			log.warn("토큰으로부터 얻은 Member: {}", member);
			return member;
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}



	public boolean changeNickName(String token, String nickname) {

		Long memberId =getMemberId(token);
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new RuntimeException("해당 이메일의 회원을 찾을 수 없습니다."));

		// 닉네임 변경
		member.setNickName(nickname);
		memberRepository.save(member); // 변경 사항 저장
		return true;
	}




	public List<MemberPermissionResDto> convertTokenToPermission(String token) {
		// 토큰 앞에 있는 "Bearer " 제거
		token = token.replace("Bearer ", "");

		// token을 통해 memberId를 담고 있는 객체 Authentication을 불러옴
		Authentication authentication = tokenProvider.getAuthentication(token);
		Long memberId = Long.parseLong(authentication.getName());

		// Member를 통해 해당 Permission 정보 조회
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new RuntimeException("존재하지 않는 memberId 입니다."));

		// 해당 member의 Permission 정보 조회 (여러 개가 나올 수 있음)
		List<Permission> permissions = permissionRepository.findByMember(member);

		if (permissions.isEmpty()) {
			throw new RuntimeException("해당 member에 대한 Permission 정보가 없습니다.");
		}

		List<MemberPermissionResDto> result = new ArrayList<>();

		// 여러 개의 Permission 정보를 처리
		for (Permission permission : permissions) {
			// "ACTIVE"인 경우에만 DTO 생성하여 반환
			if (Active.ACTIVE.equals(permission.getActive())) {
				Univ univ = permission.getUniv();  // permission에서 univ 정보 가져오기

				if (univ == null) {
					throw new RuntimeException("Permission에 대학교 정보가 없습니다.");
				}

				// Member의 univ 정보가 없으면 permission에서 가져온 univ를 사용
				if (member.getUniv() == null) {
					member.setUniv(univ);  // univ 설정
				}

				result.add(new MemberPermissionResDto(
						member.getMemberId(),
						univ.getUnivName(),
						univ.getUnivDept()
				));
			}
		}

		// 결과 반환 (여러 개의 DTO 반환)
		return result;
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