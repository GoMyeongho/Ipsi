package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Pay {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long payId;

	@ManyToOne
	@JoinColumn(name = "file_id", nullable = false)
	private FileBoard fileBoard;

	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@Column(name = "status", nullable = false)
	private String status; // 결제 상태 (예: PENDING, APPROVED, FAILED)

	@Column(name = "pay_reg_date", nullable = false)
	private LocalDateTime regDate;

	@Column(name = "price", nullable = false)
	private int price; // 결제 금액

	@Column(name = "fileOwner_amount", nullable = true)
	private int fileOwnerAmount; // 파일 등록자가 받는 금액

	@Column(name = "admin_amount", nullable = true)
	private int adminAmount; // 관리자가 받는 금액

	@Column(name = "purchased")
	private boolean purchased;

	@PrePersist
	public void prePersist() {
		regDate = LocalDateTime.now();
		if (status == null) {
			status = "PENDING"; // 기본 상태를 PENDING으로 설정
		}
	}

}
