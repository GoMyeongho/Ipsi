package kh.BackendCapstone.entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="bank_list")
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // IDENTITY로 변경
    @Column(name = "bank_id")
    private Long bankId;


    @Column(nullable = false)
    private String bankName;

}
