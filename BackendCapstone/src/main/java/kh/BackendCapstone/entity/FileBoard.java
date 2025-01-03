package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.FileCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity @Getter @Setter
@NoArgsConstructor @ToString
public class FileBoard {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long fileId;
	
	@Column(nullable = false, name = "file_title")
	private String title;
	private String mainFile;
	private String preview;
	
	@Lob
	@Column(nullable = false, length = 1024)
	private String summary;
	
	private int price;
	
	@Enumerated(EnumType.STRING)
	private FileCategory fileCategory;
	
	@Column(name = "file_reg_date")
	private LocalDateTime regDate;      // 게시글 등록 일자
	
	@PrePersist
	public void prePersist() {
		regDate = LocalDateTime.now();
	}
	
	@ManyToOne
	@JoinColumn(name="member_id")
	private Member member;

	@ManyToOne
	@JoinColumn(name="univ_id")
	private Univ univ;

	
}
