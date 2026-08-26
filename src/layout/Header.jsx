import reactLogo from "../assets/hero.png"
import logo from "../assets/fwallet-icon.svg"
export function Header() {
  return (
  <div className="header">
    <div className="header-container">
      <button className="logo-container">
          <img src={logo} alt="logo" className="logo"/>
          <h2>FWallet</h2>
          <p>تحكم مالي شامل من مكان واحد</p>
        </button>
  <div className="left-side ">
   <button className="sync">
    <span>مزامنة الحسابات</span>
    <i className="fa-solid fa-rotate"></i>
   </button>
    <button  className="transfer">
    <span>تحويل مالي جديد</span>
    <i className="fa-regular fa-paper-plane"></i>
  </button>
      <button className="notification">
      <i className="fa-regular fa-bell"></i>
    </button>
     <div className="header-profile">
    <div className="profile-head-img">
        <img  src={reactLogo}></img>  
    </div>
    </div>
  </div>  

    </div>
  
  </div>);
}
