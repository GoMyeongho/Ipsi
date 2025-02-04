package kh.BackendCapstone.entity;

import kh.BackendCapstone.constant.Active;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "univ_id")  // univ_id 컬럼 이름 변경
	private Univ univ;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	private String permissionUrl;

	@Enumerated(EnumType.STRING)
	private Active active = Active.INACTIVE;
	
	@Column(name = "permission_reg_date")
	private LocalDateTime regDate;
	
	@Column(name = "permission_active_date")
	private LocalDateTime activeDate;
	
	
	@PrePersist
	public void prePersist() {regDate = LocalDateTime.now();}
}
