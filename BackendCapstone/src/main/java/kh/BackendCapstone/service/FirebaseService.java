package kh.BackendCapstone.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.MultiValueMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseService {
	
	private final RestTemplate restTemplate;
	
	public String handleFileUpload(MultipartFile file, String folderPath) {
		// Flask API로 요청 보내기
		String flaskUrl = "http://localhost:5000/spring/upload/firebase";
		
		// 파일을 포함한 멀티파트 데이터 전송을 위한 HttpHeaders 설정
		HttpHeaders headers = new HttpHeaders();
		
		// Multipart 파일과 폴더 경로를 전송하는 방식으로 변경
		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("file", file.getResource());
		body.add("folderPath", folderPath);
		
		// HttpEntity로 요청 본문 만들기
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
		
		try {
			// Flask API로 POST 요청 보내기
			ResponseEntity<String> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, entity, String.class);
			log.warn("플라스크 통신으로 인한 결과 : {}",response);
			// Flask 서버의 응답 처리
			return response.getBody();
		} catch (Exception e) {
			log.error("Flask 서버와의 통신 중 오류 발생: ", e);
			return "파일 업로드 중 오류가 발생했습니다.";
		}
	}
}
