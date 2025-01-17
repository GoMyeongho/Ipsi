package kh.BackendCapstone.controller;

import kh.BackendCapstone.service.FirebaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/firebase")
@Slf4j
public class FirebaseController {
	private final FirebaseService firebaseService;
	
	@PostMapping("/upload/test")
	public String uploadTest(@RequestParam("file") MultipartFile file) {
		return firebaseService.handleFileUpload(file, "test");
	}
}
