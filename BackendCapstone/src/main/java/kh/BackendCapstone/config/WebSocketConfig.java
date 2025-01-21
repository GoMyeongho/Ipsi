package kh.BackendCapstone.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@Slf4j
@RequiredArgsConstructor // final 필드의 생성자만 만들어 줌
@EnableWebSocket // 의존성 추가 했기 때문에 보여짐
public class WebSocketConfig implements WebSocketConfigurer {
	private final WebSocketHandler webSocketHandler;

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		log.info("소켓 핸들러 생성~~~~~~");
		registry.addHandler(webSocketHandler, "/ws/chat").setAllowedOrigins("*");
	}
}