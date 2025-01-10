package kh.BackendCapstone.constant;

import lombok.Getter;

// 엔티티 테이블에 삭제를 위한 방법 : db에서 불러올때나 back에서 불러올 때나 Active를 감지하는 코드를 이용하면
// 삭제와 똑같은 효과를 볼 수 있음, 웬만하면 db에서 감지하는게 좋음
@Getter
public enum Active {
	ACTIVE("ACTIVE"),
	INACTIVE("INACTIVE");
	
	private final String value;
	
	// 생성자에서 문자열 값을 설정
	Active(String value) {
		this.value = value;
	}
	
	// 문자열을 받아 해당 enum 항목을 반환하는 메서드
	public static Active fromString(String status) {
		for (Active state : Active.values()) {
			if (state.getValue().equalsIgnoreCase(status)) {
				return state;
			}
		}
		throw new IllegalArgumentException("Unexpected value: " + status);
	}
}
