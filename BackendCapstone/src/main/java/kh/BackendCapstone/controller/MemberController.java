package kh.BackendCapstone.controller;

import kh.BackendCapstone.dto.request.MemberReqDto;
import kh.BackendCapstone.dto.response.MemberResDto;
import kh.BackendCapstone.jwt.TokenProvider;
import kh.BackendCapstone.security.SecurityUtil;
import kh.BackendCapstone.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MemberController {
	
	private final MemberService memberService;
	private final TokenProvider tokenProvider;

	// 전체 회원 조회
	@GetMapping("/list")
	public ResponseEntity<List<MemberResDto>> allMember() {
		List<MemberResDto> rsp = memberService.allMember();
		log.info("rsp : {}", rsp);
		return ResponseEntity.ok(rsp);
	}

	// 회원 이메일 조회
/*	@GetMapping("/{email}")
	public ResponseEntity<MemberResDto> findMember(@PathVariable String email) {
		MemberResDto memberResDto = memberService.findMember(email);
		log.info("memberResDto : {}", memberResDto);
		return ResponseEntity.ok(memberResDto);
	}*/
	@GetMapping("/nickName")
	public ResponseEntity<String> getEmailFromToken(@RequestHeader("Authorization") String token) {
		try {
			String nickName = memberService.convertTokenToEntity(token).getNickName();
			return ResponseEntity.ok(nickName);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		}
	}
	
	@PostMapping("/updateUser")
	public ResponseEntity<Boolean> updateMember(@RequestBody MemberReqDto memberReqDto) {
		boolean isSuccess = memberService.updateMember(memberReqDto);
		log.info("수정 성공 여부 : {}", isSuccess);
		return ResponseEntity.ok(isSuccess);
	}
	
	@PostMapping("/deleteUser/{email}")
	public ResponseEntity<Boolean> deleteMember(@PathVariable String email) {
		boolean isSuccess = memberService.deleteMember(email);
		log.info("삭제 성공 여부 : {}", isSuccess);
		return ResponseEntity.ok(isSuccess);
	}
	// 받는거
	@GetMapping("/isRole/{role}")
	public ResponseEntity<Boolean> isRole(@PathVariable String role, @RequestHeader("Authorization") String token) {
		boolean isSuccess = memberService.isRole(role, token);
		return ResponseEntity.ok(isSuccess);
	}
}
