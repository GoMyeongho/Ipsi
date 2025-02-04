package kh.BackendCapstone.entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class UserBank {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "userbank_id")
    private Long userBankId;

    private String bankName;
    private String bankAccount;
    private  Long withdrawal;

    @OneToOne
    @JoinColumn(name = "member_id", unique = true) // Member와 1:1 관계
    private Member member;
}
