package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.request.ReviewReqDto;
import kh.BackendCapstone.dto.response.ReviewResDto;
import kh.BackendCapstone.entity.FileBoard;
import kh.BackendCapstone.entity.Member;
import kh.BackendCapstone.entity.Review;
import kh.BackendCapstone.repository.FileBoardRepository;
import kh.BackendCapstone.repository.MemberRepository;
import kh.BackendCapstone.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository; // 댓글 리포지토리
    private final FileBoardRepository fileBoardRepository;
    private final MemberRepository memberRepository;

    // fileBoardId로 댓글 목록 조회 (페이지네이션 처리, 최신 댓글 순으로)
    public Page<ReviewResDto> getReviewByFileBoardId(Long fileBoardId, int page, int size) {
        // PageRequest는 0부터 시작하는 페이지 번호를 사용하므로, page - 1을 해줘야 합니다.
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "reviewRegDate"));

        // fileBoardId로 FileBoard 객체 찾기
        FileBoard fileBoard = fileBoardRepository.findById(fileBoardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 FileBoard가 없습니다. ID: " + fileBoardId));

        // Page로 댓글 조회 (페이지네이션과 정렬 적용)
        Page<Review> reviewPage = reviewRepository.findByFileBoard(fileBoard, pageable);

        // Page<Review>를 Page<ReviewResDto>로 변환하여 반환
        return reviewPage.map(review -> new ReviewResDto(
                review.getReviewContent(),
                review.getReviewRegDate(),
                review.getMember().getName()
        ));
    }


    // Review 등록 저장 로직
    @Transactional
    public ReviewResDto saveReview(ReviewReqDto requestDto) {
        Member member = memberRepository.findById(requestDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));
        FileBoard fileBoard = fileBoardRepository.findById(requestDto.getFileBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));

        Review review = Review.builder()
                .reviewContent(requestDto.getReviewContent())
                .reviewRegDate(LocalDateTime.now())      // 작성 시간 (현재 시간)
                .member(member)
                .fileBoard(fileBoard)
                .build();

        reviewRepository.save(review);

        // ReviewResDto 객체 생성 및 데이터 설정
        ReviewResDto responseDto = new ReviewResDto();
        responseDto.setReviewContent(review.getReviewContent());
        responseDto.setReviewRegDate(review.getReviewRegDate());
        responseDto.setMemberId(member.getMemberId());
        responseDto.setFileBoardId(fileBoard.getFileId());

        // 응답 반환
        return responseDto;
    }
}
