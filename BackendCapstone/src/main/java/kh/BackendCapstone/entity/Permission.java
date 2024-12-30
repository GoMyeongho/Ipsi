package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter @Setter @ToString @Entity
public class Permission {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long permissionId;
	
	@ManyToOne
	@JoinColumn(name = "univ_id")
	private Univ univ;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	@Column(name = "permission_reg_date")
	private LocalDateTime regDate;
	
	@PrePersist
	public void prePersist() {regDate = LocalDateTime.now();}
}
