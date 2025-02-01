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
	const [searchQuery, setSearchQuery] = useState("");
	const [searchOption, setSearchOption] = useState("");
	const [sortOption, setSortOption] = useState("")
	const [search, setSearch] = useState("");
	
	return (
		<TextContext.Provider value={{postList, setPostList, post, setPost, commentList, setCommentList
			, page, setPage, size, setSize, maxPage, setMaxPage, searchQuery, setSearchQuery, sortOption, setSortOption
			, search, setSearch, searchOption, setSearchOption}}>
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