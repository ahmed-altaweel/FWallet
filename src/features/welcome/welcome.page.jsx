import "./welcome.style.css"
import { useNavigate } from "react-router-dom"
export function WelcomePage(){
    const navigate=useNavigate()
    return (
            <div className="welcome-page">

            <header className="welcome-header">
                <div className="logo">
                   <img src="/fwallet-icon.svg" alt="FWallet Logo" />
                  <h2>FWallet</h2>    
                </div>

                <div className="auth-btns">
                        <button className="login-btn" onClick={()=>navigate("/login")}>
                    تسجيل الدخول
                </button>
                <button className="register-btn" onClick={()=>navigate("/signup")}>
                    إنشاء حساب
                </button>
                </div>

            

            </header>


            <main className="welcome-main">

                <div className="welcome-text">

                    <p className="small-title">
                        محفظتك الرقمية
                    </p>

                    <h1>
                        أموالك في
                        <br />
                        <span>مكان واحد</span>
                    </h1>

                    <p className="description">
                      FWallet تساعدك على إدارة أموالك ومعاملاتك بطريقة سهلة ومنظمة، لتبقى على اطلاع دائم بأموالك وتتحكم في معاملاتك من مكان واحد.
                    </p>

                    <button className="start-btn" onClick={()=>navigate("/signup")}>
                        ابدأ الآن
                    </button>

                </div>


                <div className="wallet-preview">

                    <div className="wallet-card">

                        <div className="card-header">
                            <span>FWallet</span>
                            
                        </div>

                        <div className="card-balance">
                            <p>الرصيد</p>
                            <h2>25,850 <span>ر.ي</span></h2>
                        </div>

                        <div className="card-number">
                            •••• •••• •••• 4582
                        </div>

                    </div>

                </div>

            </main>

        </div>
    )

}