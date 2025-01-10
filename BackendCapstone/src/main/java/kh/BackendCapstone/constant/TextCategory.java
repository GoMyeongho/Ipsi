package kh.BackendCapstone.constant;

import lombok.Getter;

@Getter
public enum TextCategory {
	DEFAULT("default"), FAQ("faq"), WEB_REVIEW("webReview");
	
	// 해당 enum 항목의 문자열 값을 가져오는 메서드
	private final String value;
	
	// 생성자에서 문자열 값을 설정
	TextCategory(String value) {
		this.value = value;
	}
	
	// 문자열을 받아 해당 enum 항목을 반환하는 메서드
	public static TextCategory fromString(String category) {
		for (TextCategory textCategory : TextCategory.values()) {
			if (textCategory.getValue().equalsIgnoreCase(category)) {
				return textCategory;
			}
		}
		throw new IllegalArgumentException("Unexpected value: " + category);
	}
}

