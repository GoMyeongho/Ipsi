    package kh.BackendCapstone.service;


    import kh.BackendCapstone.dto.response.UnivResDto;
    import kh.BackendCapstone.entity.FileBoard;
    import kh.BackendCapstone.entity.Univ;
    import kh.BackendCapstone.repository.FileBoardRepository;
    import kh.BackendCapstone.repository.UnivRepository;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.stereotype.Service;

    import java.util.*;
    import java.util.stream.Collectors;

    @Service
    @Slf4j
    @RequiredArgsConstructor
    public class UnivService {
        private  final UnivRepository univRepository;
        private final FileBoardRepository fileBoardRepository;

        // Service(에서) 데이터 로딩
        public List<Map<String, Object>> getDropDownList() {
            try {
                // 모든 대학 조회
                List<Univ> univs = univRepository.findAll();
                List<Map<String, Object>> dropdownList = new ArrayList<>(); // List로 선언

                // 대학별 학과 리스트 생성
                for (Univ univ : univs) {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("univName", univ.getUnivName());
                    entry.put("departments", Arrays.asList(univ.getUnivDept().split(","))); // 학과 분리
                    dropdownList.add(entry); // List에 추가
                }
                return dropdownList;
            } catch (Exception e) {
                log.error("드롭다운 리스트 조회 실패: {}", e.getMessage(), e);
                throw new RuntimeException("드롭다운 리스트를 조회하는 중 문제가 발생했습니다.");
            }
        }

        // 페이지네이션 및 필터링 처리
//        public List<UnivResDto> getContents(int page, int limit, String univName, String univDept) {
//            Pageable pageable = Pageable.ofSize(limit).withPage(page - 1);
//
//            // Univ 데이터 가져오기
//            Page<Univ> univPage = univRepository.findByFilters(univName, univDept, pageable);
//
//            // UnivResDto로 변환
//            return univPage.stream()
//                    .map(univ -> {
//                        // 파일보드 정보 가져오기
//                        Long fileBoardId = fileBoardRepository.findFileBoardIdByUnivId(univ.getUnivId());
//                        String fileTitle = fileBoardRepository.findFileTitleById(fileBoardId);
//
//                        // 멤버 정보 가져오기
//                        String memberName = memberRepository.findMemberNameByFileBoardId(fileBoardId);
//                        String memberEmail = memberRepository.findMemberEmailByFileBoardId(fileBoardId);
//
//                        // 가격 정보 가져오기
//                        int price = priceRepository.findPriceByFileBoardId(fileBoardId);
//
//                        List<FileBoard> fileBoards = fileBoardRepository.findByUniv(univ); // Univ 객체를 전달
//                        for (FileBoard fileBoard : fileBoards) {
//                            String memberName = fileBoard.getMember() != null ? fileBoard.getMember().getName() : "Unknown";
//
//
//                            // DTO 생성 및 반환
//                        return new UnivResDto(
//                                univ.getUnivId(),
//                                univ.getUnivName(),
//                                univ.getUnivDept(),
//                                univ.getUnivImg(),
//                                file
//                                price,
//                                memberName,
//                                memberEmail,
//                                fileBoardId,
//                                fileTitle
//                        );
//                    })
//                    .collect(Collectors.toList());
//        }

        // 페이지 수 조회
        public int getUnivPageCount(int page, int limit, String univName, String univDept) {
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("univName").ascending());

            try {
                Page<Univ> univPage = univRepository.findByFilters(univName, univDept, pageable);
                return univPage.getTotalPages(); // 전체 페이지 수 반환
            } catch (Exception e) {
                log.error("페이지 수 조회 실패 : {}", e.getMessage(), e);
                throw new RuntimeException("페이지 수를 조회하는 중 문제가 발생했습니다.");
            }
        }

        // 페이지네이션 및 필터링 처리
        public List<UnivResDto> getContents(int page, int limit, String univName, String univDept) {
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("univName").ascending());

            try {
                // 필터링된 대학 데이터를 가져옴
                Page<Univ> univPage = univRepository.findByFilters(univName, univDept, pageable);

                List<UnivResDto> univResDtoList = univPage.stream().flatMap(univ -> {
                    // 해당 대학의 파일보드 리스트 가져오기
                    List<FileBoard> fileBoards = fileBoardRepository.findByUniv(univ);

                    return fileBoards.stream().map(fileBoard -> new UnivResDto(
                            univ.getUnivId(),
                            univ.getUnivName(),
                            univ.getUnivDept(),
                            univ.getUnivImg(),
                            fileBoard.getPrice(),
                            fileBoard.getMember() != null ? fileBoard.getMember().getName() : "Unknown",
                            fileBoard.getMember() != null ? fileBoard.getMember().getEmail() : "Unknown",
                            fileBoard.getFileId(),
                            fileBoard.getTitle()
                    ));
                }).collect(Collectors.toList());
                log.warn("{}",univPage);
                return univResDtoList;

            } catch (Exception e) {
                log.error("전체 조회 실패 : {} - {}", e.getMessage(), e);
                throw new RuntimeException("데이터 조회 실패: " + e.getMessage());
            }
        }
    }
