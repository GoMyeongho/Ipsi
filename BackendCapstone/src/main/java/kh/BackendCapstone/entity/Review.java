package kh.BackendCapstone.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter @Setter @ToString
@Entity @NoArgsConstructor
@AllArgsConstructor
@Builder

public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long reviewId;
	
	@Column(name = "review_content")
	private String reviewContent;
	
	@Column(name = "review_reg_date")
	private LocalDateTime reviewRegDate;
	
	@ManyToOne
	@JoinColumn(name = "file_id")
	private FileBoard fileBoard;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
}
