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
	
	// 문자열을 받아 해당 enum 항목을 반환하는 메서드
	public static Authority fromString(String authority) {
		for (Authority auth : Authority.values()) {
			if (auth.getValue().equalsIgnoreCase(authority)) {
				return auth;
			}
		}
		throw new IllegalArgumentException("Unexpected value: " + authority);
	}
}
