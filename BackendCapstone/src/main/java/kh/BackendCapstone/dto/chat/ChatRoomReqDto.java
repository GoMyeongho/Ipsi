package kh.BackendCapstone.dto.chat;

import kh.BackendCapstone.constant.ChatRoomType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomReqDto { //채팅방 생성 요청시 전달되는 데이터
    private String name;
    private ChatRoomType roomType = ChatRoomType.PRIVATE; // 기본값 설정
    private int personCnt; // 참여 가능 인원 필드 추가
}
