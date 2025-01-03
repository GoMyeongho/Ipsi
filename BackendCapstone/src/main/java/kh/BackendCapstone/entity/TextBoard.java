package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.TextCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


import javax.persistence.*;
import java.time.LocalDateTime;


// 게시글에 관한 Entity
@Getter @Setter @ToString
@Entity @Table(name="text_board")
@NoArgsConstructor
public class TextBoard {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long textId;
	
	@Column(nullable = false, name = "text_title")
	private String title;
	@Lob
	@Column(nullable = false, length = 1024, name = "text_content")
	private String content;
	
	@Enumerated(EnumType.STRING)
	private TextCategory textCategory;
	
	@Enumerated(EnumType.STRING)
	private Active active;
	
	@Column(name = "text_reg_date")
	private LocalDateTime regDate;      // 게시글 등록 일자
	
	@PrePersist
	public void prePersist() {
		regDate = LocalDateTime.now();
	}
	
	@ManyToOne
	@JoinColumn(name="member_id")
	private Member member;

	
}
