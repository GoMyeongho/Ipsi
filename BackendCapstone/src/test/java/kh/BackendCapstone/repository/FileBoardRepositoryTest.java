package kh.BackendCapstone.repository;

import kh.BackendCapstone.constant.FileCategory;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Univ;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class FileBoardRepositoryTest {

    @Autowired
    private FileBoardRepository fileBoardRepository;

    // @Autowired 제거: FileCategory는 enum이므로 주입이 필요 없음
    // private FileCategory fileCategory;

    @Autowired
    private UnivRepository univRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @Transactional
    @DisplayName("자소서 및 생기부 파일 저장 테스트")
    public void testSaveFileBoard() {
        // 테스트 데이터 생성
        Univ univ = new Univ();
        univ.setUnivName("테스트 대학");
        univ.setUnivDept("테스트 학과");
        univ.setUnivImg("https://example.com/univ_img");
        univRepository.save(univ); // 대학 저장

        Member member = new Member();
        member.setName("테스트 회원");
        member.setEmail("test@example.com");
        memberRepository.save(member); // 회원 저장

        FileBoard fileBoard = new FileBoard();
        fileBoard.setTitle("테스트 파일 제목");
        fileBoard.setSummary("테스트 요약");
        fileBoard.setPrice(10000);
        fileBoard.setFileCategory(FileCategory.PERSONAL_STATEMENT);  // Enum 직접 사용
        fileBoard.setKeywords("키워드1, 키워드2");
        fileBoard.setMainFile("https://example.com/main_file");
        fileBoard.setPreview("https://example.com/preview_file");
        fileBoard.setRegDate(LocalDateTime.now());
        fileBoard.setUniv(univ);
        fileBoard.setMember(member);

        // 파일 저장
        FileBoard savedFileBoard = fileBoardRepository.save(fileBoard);

        // 저장 결과 검증
        assertThat(savedFileBoard.getFileId()).isNotNull();
        assertThat(savedFileBoard.getTitle()).isEqualTo("테스트 파일 제목");
        assertThat(savedFileBoard.getUniv().getUnivName()).isEqualTo("테스트 대학");
        assertThat(savedFileBoard.getMember().getName()).isEqualTo("테스트 회원");
    }

    @Test
    @Transactional
    @DisplayName("파일 카테고리로 조회 테스트")
    public void testFindByFileCategory() {
        // 테스트 데이터 생성
        Univ univ = new Univ();
        univ.setUnivName("테스트 대학");
        univ.setUnivDept("테스트 학과");
        univRepository.save(univ);

        Member member = new Member();
        member.setName("테스트 회원");
        member.setEmail("test@example.com");
        memberRepository.save(member);

        FileBoard fileBoard = new FileBoard();
        fileBoard.setTitle("테스트 파일 제목");
        fileBoard.setSummary("테스트 요약");
        fileBoard.setPrice(10000);
        fileBoard.setFileCategory(FileCategory.PERSONAL_STATEMENT);  // Enum 직접 사용
        fileBoard.setKeywords("키워드1, 키워드2");
        fileBoard.setMainFile("https://example.com/main_file");
        fileBoard.setPreview("https://example.com/preview_file");
        fileBoard.setRegDate(LocalDateTime.now());
        fileBoard.setUniv(univ);
        fileBoard.setMember(member);
        fileBoardRepository.save(fileBoard);

        // 파일 카테고리로 조회
        List<FileBoard> fileBoards = fileBoardRepository.findAllByFileCategory(FileCategory.PERSONAL_STATEMENT);  // Enum 직접 사용

        // 조회 결과 검증
        assertThat(fileBoards).isNotEmpty();
        assertThat(fileBoards.get(0).getFileCategory()).isEqualTo(FileCategory.PERSONAL_STATEMENT);
    }
}
