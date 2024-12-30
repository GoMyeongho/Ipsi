package kh.BackendCapstone.entity;


import lombok.*;

import javax.persistence.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "university")
public class Univ {
	@Id // 해당 필드를 기본키로 지정
	@Column(name="univ_id")
	@GeneratedValue(strategy= GenerationType.AUTO) //JPA 가 자동으로 생성 전략을 정함
	private Long id; // Primary Key
	
	@Column(unique = true)
	private String univName;
	@Column(unique = true)
	private String univDept;
	private String univImg;
}
