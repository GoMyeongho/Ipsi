package kh.BackendCapstone.controller;


import com.kh.springJpa241217.dto.TokenDto;
import com.kh.springJpa241217.dto.request.MemberReqDto;
import com.kh.springJpa241217.dto.response.MemberResDto;
import com.kh.springJpa241217.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;
	
	//회원가입 여부 확인
	@GetMapping("/exist/{email}")
	public ResponseEntity<Boolean> isMember (@PathVariable String email) {
		boolean isMember = authService.isMember(email);
		log.info("isMember : {}", isMember);
		return ResponseEntity.ok(!isMember);
	}
	
	// 회원 가입
	@PostMapping("/signup")
	public ResponseEntity<MemberResDto> signup(@RequestBody MemberReqDto memberReqDto) {
		MemberResDto memberResDto = authService.signup(memberReqDto);
		log.info("signup : {}", memberResDto);
		return ResponseEntity.ok(memberResDto);
	}
	
	// 로그인
	@PostMapping("/login")
	public ResponseEntity<TokenDto> login(@RequestBody MemberReqDto memberReqDto) {
		TokenDto tokenDto = authService.login(memberReqDto);
		log.info("tokenDto : {}", tokenDto);
		return ResponseEntity.ok(tokenDto);
	}
	
	
}
