package kh.BackendCapstone.constant;

import lombok.Getter;

@Getter
public enum Authority {
	ROLE_USER("ROLE_USER"),
	ROLE_UNIV("ROLE_UNIV"),
	ROLE_ADMIN("ROLE_ADMIN"),
	REST_USER("REST_USER");
	
	private final String value;
	
	// 생성자에서 문자열 값을 설정
	Authority(String value) {
		this.value = value;
	}
	
	public static Authority fromString(String value) {
		value = value.replace("%", "").trim(); // 와일드카드 제거
		return switch (value.toUpperCase()) {
			case "USER", "ROLE_USER" -> ROLE_USER;
			case "ADMIN", "ROLE_ADMIN" -> ROLE_ADMIN;
			case "UNIV", "ROLE_UNIV" -> ROLE_UNIV;
			case "REST", "REST_USER" -> REST_USER;
			default -> throw new IllegalArgumentException("Unexpected value: " + value);
		};
	}
}
