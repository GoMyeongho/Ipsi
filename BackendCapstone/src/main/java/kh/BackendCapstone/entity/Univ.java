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
	private Long univId; // Primary Key
	
	@Column(name = "univ_name")
	private String univName;

	@Column(name = "univ_dept")
	private String univDept;

	@Column(name = "univ_img")
	private String univImg;
}
