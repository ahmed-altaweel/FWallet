// import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import {ContainerBox} from "@/shared/utils/ContainerBox";
import "./search.style.css"
import {Header} from "../../layout/Header";

export function AccountsPage(){

return(
 
 <div>


{/* <ContainerBox>

</ContainerBox> */}

<SearchBar/>


    </div>
);



}


export function SearchBar() {
    return (<>
    

    <div className="container-search">
<input type="text" className="search-input" />


    </div>
    
    
    </>);
}