package kh.BackendCapstone.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.firebase.cloud.StorageClient;
import kh.BackendCapstone.repository.FirebaseDirRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseDirService {
	
	@Autowired
	private final FirebaseDirRepository firebaseDirRepository;
	
	public List<String> getImage3d(int carNo, String color) {
		String firebaseDir = "IMAGE/CAR_SP_IMAGE/" + firebaseDirRepository.getCarDir(carNo, color);
		log.info(firebaseDir);
		return getImageUrls(firebaseDir);
	}
	
	// List<String> 입력: 각 디렉토리에서 첫 번째 값만 가져와 리스트로 반환
	public List<String> getImageUrls(List<String> directories) {
		if (directories == null || directories.isEmpty()) {
			log.warn("디렉토리 목록이 비어 있습니다.");
			return Collections.emptyList(); // 빈 리스트 반환
		}
		
		List<String> imageUrls = new ArrayList<>();
		
		for (String directory : directories) {
			if (directory != null && !directory.isEmpty()) {
				List<String> urlsFromDirectory = getImageUrls(directory); // 디렉토리의 모든 값 가져오기
				if (!urlsFromDirectory.isEmpty()) {
					imageUrls.add(urlsFromDirectory.get(0)); // 첫 번째 값만 추가
				}
			} else {
				log.warn("유효하지 않은 디렉토리: " + directory);
			}
		}
		
		return imageUrls;
	}
	
	// String 입력: 해당 디렉토리의 모든 값을 List<String>으로 반환
	public List<String> getImageUrls(String directory) {
		List<String> imageUrls = new ArrayList<>();
		if (directory == null || directory.isEmpty()) {
			log.warn("디렉토리가 유효하지 않습니다.");
			return imageUrls; // 빈 리스트 반환
		}
		Bucket bucket = StorageClient.getInstance().bucket();
		log.warn("받아온 디렉토리 위치: " + directory);
		// 디렉토리 내 모든 파일을 가져옵니다.
		Iterable<Blob> blobs = bucket.list(Storage.BlobListOption.prefix(directory)).iterateAll();
		for (Blob blob : blobs) {
			// 디렉토리가 아닌 경우에만 처리
			if (!blob.isDirectory()) {
				String fileName = blob.getName();
				// 파일 확장자가 txt인 경우 파일 이름만 추가
				if (fileName.endsWith(".txt")) {
					String fileNameOnly = fileName.substring(fileName.lastIndexOf("/") + 1);
					log.warn("텍스트 파일 이름: " + fileNameOnly);
					imageUrls.add(fileNameOnly); // 파일 이름 추가
				} else {
					// Firebase Storage의 URL 형식으로 파일 경로를 인코딩하여 URL 생성
					String encodedPath = fileName.replace("/", "%2F");
					String publicUrl = String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
						bucket.getName(), encodedPath);
					imageUrls.add(publicUrl); // 이미지 URL 추가
				}
			}
		}
		return imageUrls; // 해당 디렉토리의 모든 값 반환
	}
}