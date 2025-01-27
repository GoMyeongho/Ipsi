package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter @Setter @ToString
@Entity @NoArgsConstructor
public class PsWrite {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long psId;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	@Column(name = "pa_name")
	private String psName;
	
	@Column(name = "ps_reg_date")
	private LocalDateTime regDate;
}