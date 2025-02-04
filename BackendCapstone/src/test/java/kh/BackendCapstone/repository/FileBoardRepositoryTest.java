package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Univ;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@Slf4j
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class FileBoardRepositoryTest {
    
    @Autowired
    private FileBoardRepository fileBoardRepository;
    
    @Autowired
    private UnivRepository univRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    private Univ testUniv;
    private Member testMember;
    
    @BeforeEach
    void setUp() {
        // DB에서 기존 데이터 조회 (이미 DB에 저장되어 있는 데이터 사용)
        testUniv = univRepository.findByUnivNameAndUnivDept("테스트 대학 #1", "테스트 학과 #1");
        testMember = memberRepository.findById(1L).orElse(null);
        ;
        
        // 필요한 데이터가 없을 경우 에러 처리
        assertNotNull(testUniv, "테스트를 위한 대학이 DB에 존재해야 합니다.");
        assertNotNull(testMember, "테스트를 위한 회원이 DB에 존재해야 합니다.");
    }
    
    @Test
    @Transactional
    @Rollback(false)  // 롤백을 하지 않게 설정
    @DisplayName("자소서 및 생기부 파일 저장 테스트")
    public void testSaveFileBoard() {
        // 기존 데이터를 이용하여 FileBoard 생성
        FileBoard fileBoard = new FileBoard();
        fileBoard.setTitle("테스트 파일 제목");
        fileBoard.setSummary("테스트 요약");
        fileBoard.setPrice(10000);
        fileBoard.setFileCategory(FileCategory.PERSONAL_STATEMENT);  // Enum 직접 사용
        fileBoard.setKeywords("키워드1, 키워드2");
        fileBoard.setMainFile("https://example.com/main_file");
        fileBoard.setPreview("https://example.com/preview_file");
        fileBoard.setRegDate(LocalDateTime.now());
        fileBoard.setUniv(testUniv);  // 기존 대학 데이터 사용
        fileBoard.setMember(testMember);  // 기존 회원 데이터 사용
        
        // 파일 저장
        FileBoard savedFileBoard = fileBoardRepository.save(fileBoard);
        
        // 저장 결과 검증
        assertThat(savedFileBoard.getFileId()).isNotNull();
        assertThat(savedFileBoard.getTitle()).isEqualTo("테스트 파일 제목");
        assertThat(savedFileBoard.getUniv().getUnivName()).isEqualTo(testUniv.getUnivName());
        assertThat(savedFileBoard.getMember().getName()).isEqualTo(testMember.getName());
    }
    
    // STUDENT_RECORD
    // PERSONAL_STATEMENT
    
    @Test
    @Transactional
    @DisplayName("파일 카테고리로 자소서 조회 테스트")
    public void testFindByFileCategoryPERSONAL_STATEMENT() {
        
        // 파일 카테고리로 조회
        List<FileBoard> fileBoards = fileBoardRepository.findAllByFileCategory(FileCategory.PERSONAL_STATEMENT);  // Enum 직접 사용
        // 파일보드 항목 하나하나 출력
        for (FileBoard fileBoard : fileBoards) {
            log.info("상품 조회 테스트 : {}", fileBoard);
        }
        // 조회 결과 검증
        assertThat(fileBoards).isNotEmpty();
        assertThat(fileBoards.get(0).getFileCategory()).isEqualTo(FileCategory.PERSONAL_STATEMENT);
    }
    
    @Test
    @Transactional
    @DisplayName("파일 카테고리로 생기부 조회 테스트")
    public void testFindByFileCategorySTUDENT_RECORD() {
        
        // 파일 카테고리로 조회
        List<FileBoard> fileBoards = fileBoardRepository.findAllByFileCategory(FileCategory.STUDENT_RECORD);  // Enum 직접 사용
        // 파일보드 항목 하나하나 출력
        for (FileBoard fileBoard : fileBoards) {
            log.info("상품 조회 테스트 : {}", fileBoard);
        }
        // 조회 결과 검증
        assertThat(fileBoards).isNotEmpty();
        assertThat(fileBoards.get(0).getFileCategory()).isEqualTo(FileCategory.STUDENT_RECORD);
    }
    
}
