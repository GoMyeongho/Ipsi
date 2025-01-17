package kh.BackendCapstone.service;


import kh.BackendCapstone.constant.Active;
import kh.BackendCapstone.constant.Authority;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Permission;
import kh.BackendCapstone.entity.Univ;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.PermissionRepository;
import kh.BackendCapstone.repository.UnivRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@Slf4j
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class AdminServiceTest {
	
	@Autowired
	private AdminService adminService;
	@Autowired
	private UnivRepository univRepository;
	@Autowired
	private MemberRepository memberRepository;
	@Autowired
	private PermissionRepository permissionRepository;
	
	
	@Test
	@DisplayName("권한 부여 테스트-1 : 엔티티 생성")
	public void setAdminService() {
		for (int i = 0; i < 3; i++) {
			Member member = new Member();
			member.setAuthority(Authority.ROLE_USER);
			member.setName("테스터"+ (i + 1));
			member.setEmail("test" + (i + 1) + "@gmail.com");
			member.setPwd("testtest" + (i + 1));
			member.setPhone("0" + (1000000000 + i + 1));
			member.setNickName("테스터닉네임" + (i + 1));
			Member saveMember = memberRepository.save(member);
			log.info("멤버 저장 : {}", saveMember);
			for (int j = 0; j < 2; j++) {
				Univ univ = new Univ();
				univ.setUnivImg("#" + (i + 1));
				univ.setUnivName("테스트 대학 #" + (i + 1));
				univ.setUnivDept("테스트 학과 #" + (j + 1));
				Univ saveUniv = univRepository.save(univ);
				log.info("saveUniv#{} dept#{} :{}", i+1, j+1,saveUniv);
				
				Permission permission = new Permission();
				permission.setMember(saveMember);
				permission.setPermissionUrl("#" + (i + 1) + (j + 1));
				permission.setActive(Active.INACTIVE);
				permission.setUniv(saveUniv);
				Permission savePermission = permissionRepository.save(permission);
				log.info("savePermission#{} :{}", i+1, savePermission);
			}
		}
	}
	
	
}
