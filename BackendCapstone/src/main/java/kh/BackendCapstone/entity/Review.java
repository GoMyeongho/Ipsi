package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


import javax.persistence.*;
import java.time.LocalDateTime;

@Getter @Setter @ToString
@Entity @NoArgsConstructor
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long reviewId;
	
	@Column(name = "review_content")
	private String content;
	
	@Column(name = "review_reg_date")
	private LocalDateTime regDate;
	
	@ManyToOne
	@JoinColumn(name = "file_id")
	private FileBoard fileBoard;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
}
