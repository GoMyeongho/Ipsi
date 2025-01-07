package kh.BackendCapstone.constant;

import lombok.Getter;

@Getter
public enum FileCategory {
	PERSONAL_STATEMENT("ps"),
	STUDENT_RECORD("sr");
	
	private final String code;
	
	// 생성자
	FileCategory(String code) {
		this.code = code;
	}
	
	// String 값을 받아서 해당 enum을 반환하는 메서드
	public static FileCategory fromString(String code) {
		for (FileCategory category : FileCategory.values()) {
			if (category.code.equalsIgnoreCase(code)) {
				return category;
			}
		}
		throw new IllegalArgumentException("Unexpected value: " + code);
	}
	
}
