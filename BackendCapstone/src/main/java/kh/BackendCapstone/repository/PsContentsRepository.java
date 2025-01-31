package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.PsContents;
import kh.BackendCapstone.entity.PsWrite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PsContentsRepository extends JpaRepository<PsContents,Long> {
    // psWrite 기준으로 psContents 목록 조회
    List<PsContents> findByPsWrite(PsWrite psWrite);
}
