package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.FileCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Getter @Setter
@NoArgsConstructor @ToString
public class FileBoard {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long fileId;
	
	@Column(nullable = false, name = "file_title")
	private String title; // 제목

	private String mainFile; // 자료 파일 경로
	private String preview; // 미리보기 파일 경로
	
	@Lob
	@Column(nullable = false, length = 1024)
	private String summary; // 자료 소개 글
	
	private int price; // 가격
	
	@Enumerated(EnumType.STRING)
	private FileCategory fileCategory; // 카테고리
	
	@Column(name = "file_reg_date")
	private LocalDateTime regDate; // 게시글 등록 일자

	@Column(name = "Keywords")
	private String Keywords;
	
	@PrePersist
	public void prePersist() {
		regDate = LocalDateTime.now();
	}
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="member_id")
	private Member member;

	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="univ_id")
	private Univ univ;

	
}
