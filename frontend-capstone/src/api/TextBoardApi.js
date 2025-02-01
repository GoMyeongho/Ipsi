import axios from "axios";
import Commons from "../util/Common";


const baseUrl = Commons.Capstone

const token = localStorage.getItem("accessToken");

const TextBoardApi = {
	// 카테고리별 모든 글을 가져오는 api ( 페이지네이션 포함)
	getAllTextBoardPage : async (category, size) => {
		console.log(`카테고리 ${category} 에 대한 전체 검색 페이지당 게시글 수 : ${size}`)
		return await axios.get(baseUrl + `/board/page/${category}`,{params:{size}})
	},
	getAllTextBoardList : async (category, page, size) => {
		console.log(`카테고리 ${category} 에 대한 전체 조회 페이지 : ${page}, 페이지당 게시글 수 : ${size}`)
		return await axios.get(baseUrl + `/board/find/${category}`,{params:{page, size}})
	},
	
	// 위에 제목 검색을 더한 버전
	getAllTextBoardPageByTitle : async (title, category, size) => {
		console.log(`카테고리 ${category} 에 대한 제목 : ${title} 검색 페이지당 게시글 수 : ${size}`)
		return await axios.get(baseUrl + `/board/page/title/${category}/${title}`,{params:{size}})
	},
	getAllTextBoardListByTitle : async (title, category, page, size) => {
		console.log(`카테고리 ${category} 에 대한 제목 : ${title} 검색 페이지 : ${page}, 페이지당 게시글 수 : ${size} `)
		return await axios.get(baseUrl + `/board/find/title/${category}/${title}`,{params:{page, size}})
	},
	
	// 닉네임 검색을 더한 버전
	getAllTextBoardPageByNickName : async (nickName, category, size) => {
		console.log(`카테고리 ${category} 에 대한 닉네임 : ${nickName} 검색 페이지당 게시글 수 : ${size}`)
		return await axios.get(baseUrl + `/board/page/nickName/${category}/${nickName}`,{params:{size}})
	},
	getAllTextBoardListByNickName : async (nickName, category, page, size) => {
		console.log(`카테고리 ${category} 에 대한 닉네임 : ${nickName} 검색 페이지 : ${page}, 페이지당 게시글 수 : ${size} `)
		return await axios.get(baseUrl + `/board/find/nickName/${category}/${nickName}`,{params:{page, size}})
	},
	
	// 제목 및 내용 검색을 더한 버전
	getAllTextBoardPageByTitleOrContent : async (keyword, category, size) => {
		console.log(`카테고리 ${category} 에 대한 제목 및 내용 : ${keyword} 검색 페이지당 게시글 수 : ${size}`)
		return await axios.get(baseUrl + `/board/page/titleOrContent/${category}/${keyword}`,{params:{size}})
	},
	getAllTextBoardListByTitleOrContent : async (keyword, category, page, size) => {
		console.log(`카테고리 ${category} 에 대한 제목 및 내용 : ${keyword} 검색 페이지 : ${page}, 페이지당 게시글 수 : ${size} `)
		return await axios.get(baseUrl + `/board/find/titleOrContent/${category}/${keyword}`,{params:{page, size}})
	},
	
	// 작성자 검색을 더한 버전
	getAllTextBoardPageByMember : async (email, category, size) => {
		console.log(`카테고리 ${category} 에 대한 회원 : ${email} 검색 페이지당 게시글 수 : ${size}`)
		return await axios.get(baseUrl + `/board/page/member/${category}/${email}`,{params:{size}})
	},
	getAllTextBoardListByMember : async (email, category, page, size) => {
		console.log(`카테고리 ${category} 에 대한 회원 : ${email} 검색 페이지 : ${page}, 페이지당 게시글 수 : ${size} `)
		return await axios.get(baseUrl + `/board/find/member/${category}/${email}`,{params:{page, size}})
	},
	
	// 글 작성을 위한 api
	createTextBoard : async (title, content, category) => {
		const req = {
			title: title,
			content: content,
			textCategory: category,
		}
		console.log(`글 작성을 위한 api : ${JSON.stringify(req)}`)
		return await axios.post(baseUrl + "/board/create", (req), {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	},
	
	// 글 수정을 위한 api
	updateTextBoard : async (title, content, category, boardId) => {
		const req = {
			title: title,
			content: content,
			textCategory: category,
			textId: boardId,
		}
		console.log(`글번호 : ${boardId}를 위한 글 수정을 위한 api : ${JSON.stringify(req)}`)
		return await axios.post(baseUrl + `/board/update`, req, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	},
	
	// 글 삭제를 위한 api
	deleteTextBoard: async (boardId) => {
		console.log(`글번호 : ${boardId}를 위한 글 삭제을 위한 api`)
		return await  axios.delete(baseUrl + `/board/delete/${boardId}/`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	},
	
	detailTextBoard: async (boardId) => {
		console.log(`\`글번호 : ${boardId}를 위한 글 조회를 위한 api 요청자`)
		return await  axios.get(baseUrl + `/board/find/id/${boardId}`,
		)
	},
	detailTextBoardForEdit : async (boardId) => {
		console.log(`글번호 : ${boardId}를 위한 글 수정을 위해 받아오는 api 요청자`)
		return await  axios.get(baseUrl + `/board/load/id/${boardId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	},
	isAuthor: async (boardId) => {
		console.log(`글번호 : ${boardId}의 작성자인지 확인하는 메서드`)
		return await axios.get(baseUrl + `/board/isAuthor/${boardId}`,{
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	}
}

export default TextBoardApi