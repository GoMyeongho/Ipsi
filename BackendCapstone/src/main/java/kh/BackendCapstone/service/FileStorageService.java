package kh.BackendCapstone.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final String uploadDir = "C:/dev/picture"; // 업로드 디렉토리 설정

    // 파일 저장 메서드
    public String saveFile(MultipartFile file) throws IOException {
        // 파일 이름을 고유하게 생성 (시간 기반)
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // 파일 저장 경로
        Path targetLocation = Paths.get(uploadDir + File.separator + fileName);

        // 파일 저장
        Files.copy(file.getInputStream(), targetLocation);

        // 저장된 파일 경로 반환
        return fileName;
    }

    // 파일을 삭제하는 메서드 (필요시)
    public void deleteFile(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir + File.separator + fileName);
        Files.deleteIfExists(filePath);
    }
}
