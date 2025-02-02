package kh.BackendCapstone.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ps_write")
@Getter
@Setter
@ToString(exclude = "psContents")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PsWrite {
	// 자기소개서 id
    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long psWriteId;

	// 작성자
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;

	// 자기소개서 이름
	private String psName;

	// 생성일
	@Column(name = "ps_reg_date")
	private LocalDateTime regDate;

	// 자기소개서 항목 리스트
	@OneToMany(mappedBy = "psWrite", cascade = CascadeType.ALL, orphanRemoval = false)
	private List<PsContents> psContents = new ArrayList<>();


}