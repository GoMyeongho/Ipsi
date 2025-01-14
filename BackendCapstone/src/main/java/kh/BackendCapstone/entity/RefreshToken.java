package kh.BackendCapstone.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;



@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "refresh_token")
public class RefreshToken {
    @Id
    @Column(name="refresh_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name="refresh_token")
    private String refreshToken;

    @Column(name="refresh_token_exp")
    private Long refreshTokenExpiresIn;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
        private Member member;
}