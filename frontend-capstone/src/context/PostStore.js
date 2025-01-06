import {createContext, useState} from "react";

export const PostContext = createContext(null);

const PostStore = ({children}) => {
	
	const [postList, setPostList] = useState([])
	
	
	return (
		<PostContext.Provider value={{postList, setPostList}}>
			{children}
		</PostContext.Provider>
	)
}