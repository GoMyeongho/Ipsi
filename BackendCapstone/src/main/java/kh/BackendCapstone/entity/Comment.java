package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.Active;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter @Setter @ToString
@Entity @Table(name = "comment")
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long commentId;
	
	@ManyToOne
	@JoinColumn(name = "text_id")
	private TextBoard textBoard;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	@Enumerated(EnumType.STRING)
	private Active active;
	
	@Column(length = 1000, name = "comment_content")
	private String content;
	@Column(name = "comment_reg_date")
	private LocalDateTime regDate;
	
	
	@PrePersist
	protected void onCreate() {
		regDate = LocalDateTime.now();
	}
}
