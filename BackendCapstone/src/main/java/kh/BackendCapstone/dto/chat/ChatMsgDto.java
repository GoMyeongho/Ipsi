package kh.BackendCapstone.dto.chat;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
    private LocalDateTime regDate;
}
