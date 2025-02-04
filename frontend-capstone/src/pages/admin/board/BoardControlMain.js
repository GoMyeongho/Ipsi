import TextStore from "../../../context/TextStore";
import BoardCategorySelector from "./BoardCategorySelector";
import {BackGround} from "../../../styles/GlobalStyle";
import PostListMain from "../../text/post/list/PostListMain";


const BoardControlMain = () => {
	
	
	
	
	return(
		<BackGround>
			<BoardCategorySelector/>
			<TextStore>
				<PostListMain active="INACTIVE" />
			</TextStore>
		</BackGround>
	)
}

export default BoardControlMain;