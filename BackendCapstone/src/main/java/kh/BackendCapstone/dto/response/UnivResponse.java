package kh.BackendCapstone.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UnivResponse {
    private List<UnivResDto> content;
    private int totalPages;
}
