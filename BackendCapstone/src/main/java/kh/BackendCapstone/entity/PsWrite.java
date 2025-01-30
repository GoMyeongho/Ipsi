package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@Table(name = "ps_write")
public class PsWrite {
	// 자기소개서 id
	@Id
	@Column(name = "ps_write_id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long psWriteId;

	// 작성자
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;

	// 자기소개서 이름
	@Column(name = "ps_name")
	private String psName;

	// 생성일
	@Column(name = "ps_reg_date")
	private LocalDateTime regDate;

	// 자기소개서 항목 리스트
	@OneToMany(mappedBy = "psWrite", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PsContents> psContents;
}