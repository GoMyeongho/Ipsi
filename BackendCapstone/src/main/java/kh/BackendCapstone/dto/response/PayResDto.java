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

    private Long payId;
    private String fileTitle;
    private String univName;
    private String univDept;
    private int price;
    private LocalDateTime purchaseDate;
}
