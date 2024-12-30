package kh.BackendCapstone.repository;
// 에러 발생 방지 위한 임시 파일
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@Repository
@RequiredArgsConstructor
public class FirebaseDirRepository {
	
	private final JdbcTemplate jdbcTemplate;
	private static final String BASE_SQL = "SELECT COLOR_URL FROM CAR_COLORS WHERE CAR_NO = ?";
	
	public String getCarDir(int carNo, String color) {
		log.warn("차번호 {} 의 색상 {} 의 디렉토리 조회중", carNo, color);
		
		String sql = BASE_SQL;
		Object[] params = new Object[]{carNo};
		
		// 색상이 제공된 경우 조건 추가
		if (color != null && !color.isEmpty()) {
			sql += " AND COLOR_NAME = ?";
			params = new Object[]{carNo, color};
		}
		
		// 결과 조회 및 처리
		List<String> results = jdbcTemplate.queryForList(sql, params, String.class);
		if (results.isEmpty()) {
			log.warn("결과가 없습니다. 차번호: {}, 색상: {}", carNo, color);
			return null; // 결과 없음 처리
		}
		
		return results.get(0); // 첫 번째 결과 반환
	}
}
