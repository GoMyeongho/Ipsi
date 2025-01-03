package kh.BackendCapstone.dto.response;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UnivResDto {
    private String univName; // 대학명
    private String univDept; // 학과명
    private String univImg; // 대학 로고

    private int price; // 가격
    private String name; // 이름
}
