package kh.BackendCapstone.service;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private final DefaultMessageService messageService;

    public SmsService() {
        this.messageService = NurigoApp.INSTANCE.initialize(
                "NCSA2P34FVE6IQAD",
                "JRSY3JEUEFF2NZM0WBZGLYO1CM9FGXQK",
                "https://api.coolsms.co.kr"
        );
    }

    public boolean sendSms(String phone, String verificationCode) {
        // 전화번호가 null인지 확인
        if (phone == null || phone.isEmpty()) {
            System.err.println("전화번호가 null이거나 비어 있습니다.");
            return false;
        }

        // 전화번호가 숫자만 포함되는지 확인
        if (!phone.matches("^[0-9]+$")) {
            System.err.println("전화번호는 숫자만 포함해야 합니다.");
            return false;
        }

        Message message = new Message();
        message.setFrom("01052218948"); // 발신 번호
        message.setTo(phone); // 수신 번호
        message.setText("인증번호: " + verificationCode); // 메시지 내용

        try {
            messageService.send(message); // 메시지 전송
            return true;
        } catch (NurigoMessageNotReceivedException e) {
            System.err.println("Failed Messages: " + e.getFailedMessageList());
            System.err.println("Error: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return false;
        }
    }
}
