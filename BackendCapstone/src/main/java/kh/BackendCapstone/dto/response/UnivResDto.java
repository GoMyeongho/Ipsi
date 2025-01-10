package kh.BackendCapstone.dto.response;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UnivResDto {
    private Long univId;
    private String univName; // 대학명
    private String univDept; // 학과명
    private String univImg; // 대학 로고

    private int price; // 가격
    private String memberName; // 이름
    private String memberEmail; // 이메일 추가
    private Long fileBoardId; // 파일보드 ID 추가
    private String fileTitle; // 파일 제목
}
