package kh.BackendCapstone.constant;

// 엔티티 테이블에 삭제를 위한 방법 : db에서 불러올때나 back에서 불러올 때나 Active를 감지하는 코드를 이용하면
// 삭제와 똑같은 효과를 볼 수 있음, 웬만하면 db에서 감지하는게 좋음
public enum Active {
	ACTIVE, INACTIVE
}
