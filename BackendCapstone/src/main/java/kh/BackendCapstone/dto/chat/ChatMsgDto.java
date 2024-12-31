package kh.BackendCapstone.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMsgDto {
    public enum MsgType {
        ENTER, TALK, CLOSE
    }
    private MsgType type;
    private Long id;
    private String roomId;
    private String profile;
    private String nickName;
    private String sender;
    private String msg;
    private String active;
}
