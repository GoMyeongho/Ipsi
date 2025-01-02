package kh.BackendCapstone.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomReqDto { //채팅방 생성 요청시 전달되는 데이터
    private String name;
    private String email;   // 개설자 이메일
}
