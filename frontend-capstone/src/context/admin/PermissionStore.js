import {createContext, useState} from "react";


export const PermissionContext = createContext(null);

const PermissionStore = ({children}) => {
	const [permission, setPermission] =useState({})
	const [permissionList, setPermissionList] = useState([])
	const [permissionCategory, setPermissionCategory] = useState("INACTIVE");
	const [page, setPage] = useState("main");
	const [univ, setUniv] = useState({})
	const [univList, setUnivList] = useState([]);
	const [univNameList, setUnivNameList] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchOption, setSearchOption] = useState("");
	const [boardCategory, setBoardCategory] = useState("default");
	
	
	
	return (
		<PermissionContext.Provider value={{permission, permissionList, setPermission, setPermissionList
			, permissionCategory, setPermissionCategory, page, setPage, univ, setUniv, univList, setUnivList, univNameList, setUnivNameList
			, searchOption, setSearchOption, searchQuery, setSearchQuery, boardCategory, setBoardCategory}}>
			{children}
		</PermissionContext.Provider>
	)
}
export default PermissionStore;