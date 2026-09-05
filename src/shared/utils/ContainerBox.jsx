
import "./ContainerBox.style.css";


export function ContainerBox({ children }) {

    return (
        <div className="container-box">
            {children}
        </div>
    );
}