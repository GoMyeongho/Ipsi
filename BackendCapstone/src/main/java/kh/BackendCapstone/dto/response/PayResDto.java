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

public class PayResDto {

    // pay TB
    private Long payId;
    private int price;
    private LocalDateTime purchaseDate;
    private String status;

    // fileBoard TB
    private Long fileId;
    private String fileTitle;
    private String mainFile;
    private String preview;
    private String keywords;
    private String summary;
    private LocalDateTime regDate;
    private String memberName;

    // univ TB
    private String univImg;
    private String univName;
    private String univDept;

}
