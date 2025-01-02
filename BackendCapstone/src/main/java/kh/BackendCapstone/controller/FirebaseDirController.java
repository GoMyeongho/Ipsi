package kh.BackendCapstone.controller;

import kh.BackendCapstone.service.FirebaseDirService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequestMapping("/customize")
@RestController
public class FirebaseDirController {
	
	@Autowired
	private FirebaseDirService firebaseDirService;
	
	
	@GetMapping("/getImages")
	public ResponseEntity<List<String>> getImages(@RequestParam int carNo, @RequestParam String color) {
		List<String> imageList = firebaseDirService.getImage3d(carNo, color);
		log.warn("링크 리스트 : {}", imageList);
		return ResponseEntity.ok(imageList);
	}
}
