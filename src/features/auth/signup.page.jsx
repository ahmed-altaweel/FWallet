import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../core/auth/AuthContext";
// import "./auth.style.css"
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function showUserNameError(error){
        return (
            <div className="username-error error-message">
              <span>⚠</span>  {error}    
            </div>
        );
     }

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    if (step === 1) {
      const fullName = formData.get("fullName") || "";
      const username = formData.get("username") || "";

      if (!fullName.trim() || !username.trim()) {
        setError("أكمل الاسم الكامل واسم المستخدم.");
        return;
      }

      setData((prev) => ({ ...prev, avatar, fullName, username }));
      setStep(2);
      return;
    }

    if (step === 2) {
      const email = formData.get("email") || "";
      const phone = formData.get("phone") || "";
      const nationalId = formData.get("nationalId") || "";

      if (!email.trim() || !phone.trim() || !nationalId.trim()) {
        setError("أكمل البريد الإلكتروني ورقم الهاتف والرقم الوطني.");
        return;
      }

      setData((prev) => ({ ...prev, email, phone, nationalId }));
      setStep(3);
      return;
    }

    if (step === 3) {
      const gender = formData.get("gender") || "";
      const birthDate = formData.get("birthDate") || "";
      const address = formData.get("address") || "";

      if (!gender || !birthDate || !address.trim()) {
        setError("أكمل الجنس وتاريخ الميلاد والعنوان.");
        return;
      }

      setData((prev) => ({ ...prev, gender, birthDate, address }));
      setStep(4);
      return;
    }

    if (step === 4) {
      const password = formData.get("password") || "";
      const confirmPassword = formData.get("confirmPassword") || "";

      if (!password || !confirmPassword) {
        setError("أدخل كلمة المرور وتأكيدها.");
        return;
      }

      if (password !== confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return;
      }

      try {
        const payload = { ...data, password };
        let user = typeof register === "function" ? await register(payload) : null;
        console.log(user || payload);
        navigate("/login");
      } catch (err) {
        setError(err?.message || "حدث خطأ أثناء إنشاء الحساب.");
      }
    }
  };

  const back = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  return (
    <div className="form signup" dir="rtl">
      <div className="form-logo">
        <img src="/fwallet-icon.svg" alt="FWallet" />
        <p>FWallet</p>
      </div>

      <div className="form-title">قم باستكمال جميع الخطوات لانشاء الحساب</div>
      

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-step-title">الخطوة {step} من 4</div>
        {step === 1 && (
          <>
            {/* <div className="signup-avatar">
              <label className="signup-avatar-box">
                {avatar ? <img src={avatar} alt="الصورة الشخصية" /> : <Camera />}
                <input type="file" accept="image/*" onChange={uploadAvatar} hidden />
              </label>
              <span>الصورة الشخصية</span>
            </div> */}

            <div className="user-name input">
              <label htmlFor="fullName">الاسم الكامل</label>
              <input className={error && "input-error"} name="fullName" type="text" defaultValue={data.fullName} />
               {error &&showUserNameError(error)}
            </div>

            <div className="user-name input">
              <label htmlFor="username">اسم المستخدم</label>
              <input className={error && "input-error"} name="username" type="text" defaultValue={data.username} />
               {error &&showUserNameError(error)}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="user-name input">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input className={error && "input-error"} name="email" type="email" defaultValue={data.email} />
               {error &&showUserNameError(error)}
            </div>

            <div className="user-name input">
              <label htmlFor="phone">رقم الهاتف</label>
              <input className={error && "input-error"} name="phone" type="tel" defaultValue={data.phone} />
               {error &&showUserNameError(error)}
            </div>

            <div className="user-name input">
              <label htmlFor="nationalId">الرقم الوطني</label>
              <input className={error && "input-error"} name="nationalId" type="text" defaultValue={data.nationalId} />
               {error &&showUserNameError(error)}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="user-name input">
              <label htmlFor="gender">الجنس</label>
              <select className={error && "input-error"} name="gender" defaultValue={data.gender || ""}>
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
               {error &&showUserNameError(error)}
            </div>

            <div className="user-name input">
              <label htmlFor="birthDate">تاريخ الميلاد</label>
              <input className={error && "input-error"} name="birthDate" type="date" defaultValue={data.birthDate} />
               {error &&showUserNameError(error)}
            </div>

            <div className="user-name input">
              <label htmlFor="address">العنوان</label>
              <input className={error && "input-error"} name="address" type="text" defaultValue={data.address} />
               {error &&showUserNameError(error)}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="password input">
              <label htmlFor="password">كلمة المرور</label>
              <input
                className={error && "input-error"}
                name="password"
                type={showPassword ? "text" : "password"}
              />
               {error &&showUserNameError(error)}
              <button type="button" className="signup-password-toggle" onClick={() => setShowPassword((prev) => !prev)} > {showPassword ? <EyeOff  /> : <Eye  />} </button>
            </div>

            <div className="password input">
              <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
              <input
                className={error && "input-error"}
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
              />
               {error &&showUserNameError(error)}
              <button type="button" className="signup-password-toggle" onClick={() => setShowConfirm((prev) => !prev)} > {showConfirm ? <EyeOff  /> : <Eye  />} </button>
            </div>
          </>
        )}

      

        <div className="signup-buttons">
          {step > 1 && (
            <button type="button" className="signup-back" onClick={back}>
              <ArrowRight /> السابق
            </button>
          )}

          <button className="submit" type="submit">
            {step === 4 ? "إنشاء الحساب" : "التالي"} <ArrowLeft />
          </button>
        </div>
      </form>

      <div className="create-account-link">
        <p>لديك حساب؟</p>
        <NavLink className="link" to="/login">تسجيل الدخول</NavLink>
      </div>
    </div>
  );
}