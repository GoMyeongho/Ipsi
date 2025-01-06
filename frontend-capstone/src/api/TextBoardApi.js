import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.KH_DOMAIN

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
	createTextBoard : async (title, content, category, email) => {
		const req = {
			title: title,
			content: content,
			textCategory: category,
			email: email,
		}
		console.log(`글 작성을 위한 api : ${JSON.stringify(req)}`)
		return await axios.post(baseUrl + "/create", (req))
	},
	
	// 글 수정을 위한 api
	updateTextBoard : async (title, content, category, email, boardId) => {
		const req = {
			title: title,
			content: content,
			textCategory: category,
			email: email,
		}
		console.log(`글번호 : ${boardId}를 위한 글 수정을 위한 api : ${JSON.stringify(req)}`)
		return await axios.post(baseUrl + `/update/${boardId}`, req)
	},
	
	// 글 삭제를 위한 api
	deleteTextBoard: async (boardId, email) => {
		console.log(`글번호 : ${boardId}를 위한 글 삭제을 위한 api 요청자 : ${email}`)
		return await  axios.post(baseUrl + `/delete/${boardId}/${email}`)
	}
}

export default TextBoardApi