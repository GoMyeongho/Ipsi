    package kh.BackendCapstone.service;

    import kh.BackendCapstone.dto.response.UnivResDto;
    import kh.BackendCapstone.entity.FileBoard;
    import kh.BackendCapstone.entity.Univ;
    import kh.BackendCapstone.repository.FileBoardRepository;
    import kh.BackendCapstone.repository.UnivRepository;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.stereotype.Service;

    import java.util.ArrayList;
    import java.util.List;

    @Service
    @Slf4j
    @RequiredArgsConstructor
    public class UnivService {
        private  final UnivRepository univRepository;
        private final FileBoardRepository fileBoardRepository;

        public List<UnivResDto> allUniv() {
            try {
                List<Univ> univs = univRepository.findAll();

                List<UnivResDto> univResDtoList = new ArrayList<>();

                for (Univ univ : univs) {
                    // 해당 대학과 관련된 파일보드 데이터 가져오기
                    List<FileBoard> fileBoards = fileBoardRepository.findByUniv(univ); // Univ 객체를 전달

                    for (FileBoard fileBoard : fileBoards) {
                        String memberName = fileBoard.getMember() != null ? fileBoard.getMember().getName() : "Unknown";

                        UnivResDto dto = new UnivResDto(
                                univ.getUnivName(),
                                univ.getUnivDept(),
                                univ.getUnivImg(),
                                fileBoard.getPrice(),
                                memberName
                        );
                        univResDtoList.add(dto);
                    }
                }
                return univResDtoList;

            } catch (Exception e) {
                log.error("전체 조회 실패 : {} - {}", e.getMessage(), e);
                return null;
            }
        }

        public List<UnivResDto> getUnivDetails(Long univId) {
            // 특정 대학 정보 가져오기
            Univ univ = univRepository.findById(univId)
                    .orElseThrow(() -> new RuntimeException("University not found"));

            // 해당 대학의 파일보드 정보 가져오기
            List<FileBoard> fileBoards = fileBoardRepository.findByUniv(univ);

            // DTO 리스트 생성
            List<UnivResDto> result = new ArrayList<>();
            for (FileBoard fileBoard : fileBoards) {
                UnivResDto dto = new UnivResDto(
                        univ.getUnivName(),
                        univ.getUnivDept(),
                        univ.getUnivImg(),
                        fileBoard.getPrice(),
                        fileBoard.getMember().getName() // 작성자 이름 가져오기
                );
                result.add(dto);
            }
            return result;
        }
    }
