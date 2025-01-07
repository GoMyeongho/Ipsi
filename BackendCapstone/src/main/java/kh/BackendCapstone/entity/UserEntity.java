package kh.BackendCapstone.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity @Table(name="user")
@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    public String userId;
    public String password;
    private String email;
    private String type;
    private String role;

    public UserEntity(String userId, String email, String type) {
        this.userId = userId;
        this.password = "password";
        this.email = email;
        this.type = type;
        this.role = "ROLE_USER";

    }
}
