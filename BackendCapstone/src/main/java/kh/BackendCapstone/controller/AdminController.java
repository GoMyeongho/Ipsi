package kh.BackendCapstone.controller;


import kh.BackendCapstone.dto.request.AdminMemberReqDto;
import kh.BackendCapstone.dto.response.AdminMemberResDto;
import kh.BackendCapstone.dto.response.PermissionResDto;
import kh.BackendCapstone.dto.response.TextBoardListResDto;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;
	
	@GetMapping("/permission/list/{category}")
	public ResponseEntity<List<PermissionResDto>> getPermissionList(@PathVariable String category) {
		List<PermissionResDto> permissions = adminService.getPermissionList(category);
		return ResponseEntity.ok(permissions);
	}
	
	@GetMapping("/permission/details/{permissionId}")
	public ResponseEntity<PermissionResDto> getPermissionDetails(@PathVariable Long permissionId) {
		PermissionResDto permission = adminService.getPermission(permissionId);
		return ResponseEntity.ok(permission);
	}
	
	@PostMapping("/permission/active/{permissionId}/{univId}/{isUniv}")
	public ResponseEntity<Boolean> activatePermission(@PathVariable Long permissionId, @PathVariable Long univId, @PathVariable Boolean isUniv) {
		boolean isSuccess = adminService.activatePermission(permissionId, univId, isUniv);
		return ResponseEntity.ok(isSuccess);
	}
	
	@GetMapping("/univ/list")
	public ResponseEntity<List<String >> getUnivList() {
		List<String> univList = adminService.getUnivList();
		return ResponseEntity.ok(univList);
	}
	
	@GetMapping("/dept/list/{univName}")
	public ResponseEntity<List<Univ>> getDeptList(@PathVariable String univName) {
		List<Univ> univList = adminService.getDeptList(univName);
		return ResponseEntity.ok(univList);
	}
	
	@GetMapping("/member/{searchOption}/{searchValue}")
	public ResponseEntity<List<Member>> getMemberList(@PathVariable String searchOption, @PathVariable String searchValue) {
		List<Member> memberList = adminService.getMemberList(searchOption, searchValue);
		return ResponseEntity.ok(memberList);
	}
	
	@GetMapping("/member/{id}")
	public ResponseEntity<AdminMemberResDto> getMember(@PathVariable Long id) {
		AdminMemberResDto member = adminService.getMemberById(id);
		return ResponseEntity.ok(member);
	}
	
	@PostMapping("/member/edit")
	public ResponseEntity<Boolean> editMember(@RequestBody AdminMemberReqDto member) {
		boolean isSuccess = adminService.editMember(member);
		return ResponseEntity.ok(isSuccess);
	}
	
	@GetMapping("/board/{category}/{page}")
	public ResponseEntity<List<TextBoardListResDto>> getBoardList(@PathVariable String category, @PathVariable int page) {
		List<TextBoardListResDto> rst = adminService.getInActiveTextBoardList(category, page);
		return ResponseEntity.ok(rst);
	}
	@GetMapping("/page/{category}")
	public ResponseEntity<Integer> getPage(@PathVariable String category) {
		int page = adminService.getInActiveTextBoardPage(category);
		return ResponseEntity.ok(page);
	}
	
	
	
	
}
