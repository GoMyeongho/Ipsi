import {createContext, useState} from "react";
import { Outlet } from "react-router-dom";

export const TextContext = createContext(null);

const TextStore = ({children}) => {
	
	const [postList, setPostList] = useState([])
	const [post, setPost] = useState({})
	const [commentList, setCommentList] = useState([])
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [maxPage, setMaxPage] = useState(0);
	
	return (
		<TextContext.Provider value={{postList, setPostList, post, setPost, commentList, setCommentList
			, page, setPage, size, setSize, maxPage, setMaxPage, }}>
			{children}
		</TextContext.Provider>
	)
}
export default TextStore;

export const PostLayout = () => {
	return (
		<>
			<Outlet />
		</>
	);
};