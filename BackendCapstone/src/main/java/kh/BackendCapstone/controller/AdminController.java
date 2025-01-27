package kh.BackendCapstone.controller;


import kh.BackendCapstone.dto.response.PermissionResDto;
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
	
	@GetMapping("/permission/univ/list")
	public ResponseEntity<List<String >> getUnivList() {
		List<String > univList = adminService.getUnivList();
		return ResponseEntity.ok(univList);
	}
	
	@GetMapping("/permission/dept/list/{univName}")
	public ResponseEntity<List<Univ>> getDeptList(@PathVariable String univName) {
		List<Univ> univList = adminService.getDeptList(univName);
		return ResponseEntity.ok(univList);
	}
}
