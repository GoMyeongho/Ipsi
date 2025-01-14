package kh.BackendCapstone.dto.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignInResponseDto extends ResponseDto {

    private String token;
    private int expirationTime;

    private SignInResponseDto(String token) {
        this.token = token;
        this.expirationTime =3600;
    }

    public static ResponseEntity<SignInResponseDto> success(String token) {
        SignInResponseDto result = new SignInResponseDto(token);
        return ResponseEntity.ok(result);
    }

//    public static ResponseEntity<ResponseDto> signInFail(){
//
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
//    }
}
