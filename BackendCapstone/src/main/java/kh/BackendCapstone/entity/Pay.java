package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter @Setter @ToString
@Entity
public class Pay {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long payId;
	
	@ManyToOne
	@JoinColumn(name = "file_id")
	private FileBoard fileBoard;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	@Column(name = "pay_reg_date")
	private LocalDateTime regDate;
	
	@PrePersist
	public void prePersist() {regDate = LocalDateTime.now();}
}
