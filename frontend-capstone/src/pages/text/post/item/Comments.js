import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import TextBoardApi from "../../../../api/TextBoardApi";
import {useNavigate, useParams} from "react-router-dom";
import {setLoginModalOpen} from "../../../../context/redux/ModalReducer";
import {Box, Paper, Tooltip} from "@mui/material";
import ConfirmModal from "../../../../component/Modal/ConfirmModal";
import CursorModal from "../../../../component/Modal/CursorModal";
import styled from "styled-components";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import RejectModal from "../../../../component/Modal/RejectModal";
import SubmitModal from "../../../../component/Modal/SubmitModal";
import Commons from "../../../../util/Common";


const Comments = () => {
	const role = useSelector(state => state.persistent.role);
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	const [page, setPage] = useState(0);
	const [maxPage, setMaxPage] = useState(0);
	const [confirm, setConfirm] = useState({});
	const [info, setInfo] = useState({});
	const [reject, setReject] = useState({});
	const [submit, setSubmit] = useState({});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {id} = useParams()
	
	
	
	useEffect(() => {
		refreshComments();
	}, [id, page]);
	
	useEffect(() => {
		refreshPage();
	},[id])
	
	
	
	const onChangeComment = (e) => {
		if(role === "REST_USER" || role === ""){
			setConfirm({value: true, label: "로그인이 필요한 서비스 입니다. \n 로그인 하시겠습니까?"})
			return
		}
		setComment(e.target.value)
	}
	
	// 페이지 변경 핸들러
	const handlePageChange = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= maxPage) {
			setPage(pageNumber);
		}
	};
	
	// "다음" 버튼 클릭 핸들러
	const handleNext = () => {
		if (page < maxPage) {
			setPage(page + 1);
		}
	};
	
	// "이전" 버튼 클릭 핸들러
	const handlePrev = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};
	
	const onClickSubmit = async () => {
		if (comment === null || comment === "") {
			setReject({value: true, label: "댓글 내용이 없습니다.", onClose: setReject({}) });
			return;
		}
		try {
			const rsp = await TextBoardApi.createComment(id, comment);
			console.log(rsp)
			if(rsp.data) {
				setReject({value: true, label: "댓글을 작성하는데 성공 했습니다.", onClose: setReject({}) })
				refreshComments();
				refreshPage();
			} else  {
				setReject({value: true, label: "댓글을 작성하는데 실패 했습니다.", onClose: setReject({}) })
			}
		}catch (err) {
			console.error(err)
		}
	}
	
	// 페이지네이션 로직: 슬라이딩 윈도우 방식으로 페이지 번호 계산
	const pageCount = 5; // 한 번에 표시할 페이지 번호의 개수
	const startPage = Math.max(1, Math.floor((page - 1) / pageCount) * pageCount + 1); // 시작 페이지 번호, 최소 1로 설정
	const endPage = Math.min(startPage + pageCount - 1, maxPage); // 끝 페이지 번호
	
	const onClickName = (event) => {
		// 역할이 "REST_USER" 또는 빈 문자열인 경우 반환
		if (role === "REST_USER" || role === "") return;
		
		// 클릭한 위치를 받아오기
		const { clientX, clientY } = event;
		
		// setInfo 호출 시 클릭한 위치 정보도 포함시키기
		setInfo({
			value: true,
			options: options,
			position: { x: clientX, y: clientY },  // 클릭한 위치 정보 추가
		});
	};
	const options = [
		{label: "작성 글", value: "text"},
		{label: "작성 이용후기", value: "review"},
		// {label: "1대1 채팅하기", value: "chat"}
		{label: "올린 자소서 보기", value: "ps"},
		{label: "올린 생기부 보기", value: "sr"}
	]
	
	const onOption = (value) => {
		switch (value) {
			case "text":
				navigate("#");
				break;
			case "review":
				navigate("#");
				break;
			case "ps":
				navigate("#");
				break;
			case "sr":
				navigate("#");
				break;
			case "chat":
				navigate("#");
				break;
			default:
				setInfo({})
				break;
		}
	}
	
	const onClickEdit = (e) => {
		if(role === "REST_USER" || role === "") {
			setReject({value: true, label: "로그인 후 가능한 기능입니다.", onClose: () => setReject({})})
			return;
		}
		setSubmit({value: true, label: "댓글 수정", initial: e})
	}
	
	const onClickEditSubmit = async (e) => {
		console.log(e)
		if (!e.content || e.content.trim() === "") {
			setReject({ value: true, label: "댓글 내용이 비어 있습니다." });
			return;
		}
		try {
			const rsp = await TextBoardApi.updateComment(id, e.id, e.content); // 수정 요청
			console.log(rsp);
			if (rsp.data) {
				setReject({
					value: true,
					label: "댓글을 수정하는데 성공했습니다.",
					onClose: () => {
						setReject({});
					}
				});
				refreshComments(); // 댓글 목록 새로고침
			} else {
				setReject({ value: true, label: "댓글을 수정하는데 실패했습니다.", onClose: () => setReject({}) });
			}
		} catch (error) {
			console.log(error);
			setReject({ value: true, label: "서버와 통신하는데 실패했습니다.", onClose: () => setReject({}) });
		}
	};
	
	const refreshComments = async () => {
		try {
			const rsp = await TextBoardApi.getComments(id, page - 1, 10, !(role === "REST_USER" || role === ""));
			console.log(rsp);
			setComments(rsp.data); // 댓글 목록 업데이트
		} catch (error) {
			console.log(error);
		}
	};
	
	const refreshPage = async () => {
		try{
			const rsp = await TextBoardApi.getMaxPage(id, 10);
			console.log(rsp)
			setMaxPage(rsp.data)
		} catch (error) {
			console.log(error)
		}
	}
	
	
	const onClickDelete = async (e) => {
		try{
			const rsp = await TextBoardApi.deleteComment(id, e);
			console.log(rsp)
			if(rsp.data) {
				setReject({value: true, label: "댓글을 삭제하는데 성공했습니다.", onClose: () => setReject({})})
				refreshComments();
				return
			}
			setReject({value: true, label: "댓글을 삭제하는데 실패했습니다.", onClose: () => setReject({})})
		} catch (error) {
			console.log(error)
			setReject({value: true, label: "서버와 통신하는데 실패했습니다.", onClose: () => setReject({})})
		}
	}
	
	return(
		<Box>
			<BottomContainer>
				<BottomUploadBox>
					<BottomReviewWrite
						type="text"
						value={comment}
						onChange={onChangeComment}
						placeholder="댓글을 입력하세요. (50자 이내)"
						maxLength={50}
					/>
					<BottomButton onClick={onClickSubmit}>등록</BottomButton>
				</BottomUploadBox>
			{/* 리뷰 리스트 렌더링 */}
			{comments && comments.length === 0 ? (
				<CommentListBox>댓글이 없습니다.</CommentListBox>
			) : (
				comments && comments.map((comment, index) => (
					<CommentListBox key={index}>
						<CommentListTop>
							<CommentName onClick={onClickName} value={comment.memberId}>{comment.nickName}</CommentName>
							<CommentTime>{Commons.formatDateAndTime(comment.regDate)}</CommentTime>
							{comment.owner &&
								<ButtonContainer>
									<Tooltip title="댓글 수정">
										<CreateIcon onClick={() => onClickEdit({content: comment.content, id: comment.commentId})} />
									</Tooltip>
									<Tooltip title="댓글 삭제">
										<DeleteIcon onClick={() => onClickDelete(comment.commentId)}/>
									</Tooltip>
								</ButtonContainer>
							}
						</CommentListTop>
						<CommentListBottom>
							<CommentContent>{comment.content}</CommentContent>
						</CommentListBottom>
						<CommentLine />
					</CommentListBox>
				)))
			}
			</BottomContainer>
			{/* 페이지네이션 컨트롤 */}
			<PaginationContainer>
				<PaginationButton
					onClick={() => handlePageChange(1)}
					disabled={page === 1 || maxPage === 0}
				>
					{"<<"}
				</PaginationButton>
				<PaginationButton onClick={handlePrev} disabled={page === 1 || maxPage === 0}>
					{"<"}
				</PaginationButton>
				{/* 표시할 페이지 번호들 */}
				{maxPage > 0 && [...Array(endPage - startPage + 1)].map((_, index) => (
					<PaginationButton
						key={startPage + index}
						onClick={() => handlePageChange(startPage + index)}
						isActive={page === startPage + index} // 현재 페이지일 때만 보라색 배경
					>
						{startPage + index}
					</PaginationButton>
				))}
				<PaginationButton
					onClick={handleNext}
					disabled={page === maxPage || maxPage === 0}
				>
					{">"}
				</PaginationButton>
				<PaginationButton
					onClick={() => handlePageChange(maxPage)}
					disabled={page === maxPage || maxPage === 0}
				>
					{">>"}
				</PaginationButton>
			</PaginationContainer>
			<RejectModal open={reject.value} message={reject.label} onClose={() => setReject({})}/>
			<CursorModal open={info.value} message={null} position={info.position} onCancel={() => setInfo({})} onOption={(e) => onOption(e)} options={info.options} />
			<ConfirmModal message={confirm.label} open={confirm.value} onConfirm={() => {dispatch(setLoginModalOpen(true)); setConfirm({})}} onCancel={() => setConfirm({})}/>
			<SubmitModal open={submit.value} message={submit.label} onCancel={() => setSubmit({})} onSubmit={(e) => onClickEditSubmit(e)} initial={submit.initial} restriction={submit.restriction} />
		</Box>
	)
}


const BottomContainer = styled.div`
  width: 100%;
	padding: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BottomUploadBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;


const BottomReviewWrite = styled.input`
  width: 80%;
  height: 60px;
  border-radius: 10px;
  font-size: large;

  @media (max-width:768px) {
    width: 75%;
    height: 30px;
    border-radius: 5px;
    font-size: small;
  }
`;

const BottomButton = styled.button`
  width: 10%;
  height: 60px;
  border-radius: 10px;
  border: none;
  background-color: #6154D4;
  color: white;
  font-size: clamp(1rem, 1vw, 2.5rem);

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.95);
  }
`

const CommentListBox = styled.div`
  width: 100%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CommentListTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CommentName = styled.div`
  width: 33%;
  font-weight: bold;
`;

const CommentTime = styled.div`
  width: 50%;
  text-align: end;
  font-weight: bold;
`;

const CommentListBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentContent = styled.div`
  width: 100%;
  margin-top: 1%;
  text-align: start;
`;

const CommentLine = styled.div`
  width: 100%;
  margin-top: 1%;
  margin-bottom: 1%;
  border: 1px solid rgba(128,128,128,0.5);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
    background-color: ${(props) =>
            props.isActive ? "#6200ea" : "transparent"}; // 활성화된 페이지일 때 보라색 배경
    color: ${(props) =>
            props.isActive ? "white" : "black"}; // 활성화된 페이지일 때 글자색 흰색
    border: none;
    padding: 10px;
    margin: 0 5px;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")}; // disabled일 때 커서 변경
    border-radius: 5px;

    &:hover {
        background-color: ${(props) =>
                props.disabled
                        ? "transparent" // disabled일 때 hover 효과 없앰
                        : props.isActive
                                ? "#3700b3" // 활성화된 페이지일 때 hover 효과
                                : "#f0f0f0"}; // 비활성화된 페이지일 때 hover 효과
    }
`;

const ButtonContainer = styled.div`

`

export default Comments