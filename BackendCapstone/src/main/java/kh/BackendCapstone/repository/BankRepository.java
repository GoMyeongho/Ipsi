package kh.BackendCapstone.repository;

import kh.BackendCapstone.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank, Long> {
}