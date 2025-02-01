package kh.BackendCapstone.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ReviewResDto {

    private String reviewContent;
    private LocalDateTime reviewRegDate;
    private String memberName;
    private Long memberId;
    private Long fileBoardId;

    public ReviewResDto(String reviewContent, LocalDateTime reviewRegDate, String memberName) {
        this.reviewContent = reviewContent;
        this.reviewRegDate = reviewRegDate;
        this.memberName = memberName;
    }
}
