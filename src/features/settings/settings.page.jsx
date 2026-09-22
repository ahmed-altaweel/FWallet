import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./settings.style.css";
import { useAuth } from "../../core/auth/AuthContext";
import { Icon } from "@/shared/components/Icon";
import { ProfileSection } from "./sections/ProfileSection";
import { ContactSection } from "./sections/ContactSection";
import { PersonalSection } from "./sections/PersonalSection";
import { SecuritySection } from "./sections/SecuritySection";
import { detailSubtitle } from "./detailSubtitle";
import { getProfile, updateProfile } from "./Settings.Api";
import { LoadingState, ErrorState } from "@/shared/components/states";

const emptyData = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  birthDate: "",
  nationalId: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const sections = [
  {
    id: "profile",
    label: "الملف الشخصي",
    description: "صورتك، اسمك، وهوية حسابك داخل FWallet.",
    icon: "user",
    number: "01",
  },
  {
    id: "contact",
    label: "التواصل والعنوان",
    description: "البريد، الهاتف، ومعلومات التواصل الأساسية.",
    icon: "mail",
    number: "02",
  },
  {
    id: "personal",
    label: "البيانات الشخصية",
    description: "معلومات الهوية، الميلاد، والبيانات الشخصية.",
    icon: "id",
    number: "03",
  },
  {
    id: "security",
    label: "الأمان",
    description: "إدارة كلمة المرور وحماية الوصول إلى حسابك.",
    icon: "shield",
    number: "04",
  },
];

export function SettingsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile", token],
    queryFn: () => getProfile(token),
    enabled: !!token,
  });

  const [active, setActive] = useState(null);
  const [form, setForm] = useState(emptyData);
  const [saved, setSaved] = useState(emptyData);
  const [avatar, setAvatar] = useState(null);
  const [savedAvatar, setSavedAvatar] = useState(null);
  const [notice, setNotice] = useState("");
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const fileRef = useRef(null);

  // تعبئة النموذج بالبيانات الحقيقية عند وصولها من الـ API
  useEffect(() => {
    if (!profile) return;

    const loadedForm = {
      ...emptyData,
      ...profile,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    setForm(loadedForm);
    setSaved(loadedForm);
    setAvatar(profile.avatar || null);
    setSavedAvatar(profile.avatar || null);
  }, [profile]);

  const dirty = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(saved) ||
      avatar !== savedAvatar,
    [form, saved, avatar, savedAvatar]
  );

  const completeness = useMemo(() => {
    const values = {
      profile: [form.fullName, form.username],
      contact: [form.email, form.phone, form.address],
      personal: [form.gender, form.birthDate, form.nationalId],
      security: [form.currentPassword, form.newPassword, form.confirmPassword],
    };

    return Object.fromEntries(
      Object.entries(values).map(([key, arr]) => [
        key,
        Math.round((arr.filter(Boolean).length / arr.length) * 100),
      ])
    );
  }, [form]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveMutation = useMutation({
    mutationFn: (payload) => updateProfile(token, payload),
    onSuccess: (result) => {
      const savedForm = { ...emptyData, ...result };
      setSaved(savedForm);
      setForm(savedForm);
      setSavedAvatar(result.avatar || null);
      setNotice("تم حفظ التغييرات بنجاح");
      window.setTimeout(() => setNotice(""), 1800);
      queryClient.invalidateQueries({ queryKey: ["profile", token] });
    },
  });

  const save = () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
      ...profileFields
    } = form;

    saveMutation.mutate({
      ...profileFields,
      avatar,
    });
  };

  const cancel = () => {
    setForm(saved);
    setAvatar(savedAvatar);
    setNotice("تم التراجع عن التغييرات");
    window.setTimeout(() => setNotice(""), 1500);
  };

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const current = active ? sections.find((s) => s.id === active) : null;

  if (isLoading) {
    return <LoadingState message="جاري تحميل بيانات الإعدادات..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="تعذر تحميل بيانات الإعدادات"
        message={error?.message || "حدث خطأ أثناء جلب بيانات حسابك."}
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="fw-lux-page" dir="rtl">
      {notice && (
        <div className="fw-lux-notice">
          <span className="fw-lux-notice-mark">✓</span>
          {notice}
        </div>
      )}

      <div className="fw-lux-ambient fw-lux-ambient-one" />
      <div className="fw-lux-ambient fw-lux-ambient-two" />

      {!active ? (
        <div className="fw-lux-home fw-lux-view-in">
          <div className="fw-lux-hero">
            <div className="fw-lux-hero-account">
              <div className="fw-lux-hero-account-avatar profile-image">
                {savedAvatar ? (
                  <img src={savedAvatar} alt="الصورة الشخصية" />
                ) : (
                  <span>{(saved?.fullName || "م").charAt(0)}</span>
                )}
              </div>

              <div className="fw-lux-hero-account-copy">
                <span className="fw-lux-hero-account-label">حساب FWallet</span>
                <strong>{saved?.fullName || "اسم المستخدم"}</strong>
                <span className="fw-lux-hero-account-email">
                  {saved?.email || "البريد الإلكتروني"}
                </span>
              </div>

              <span
                className={`fw-lux-hero-save-dot ${dirty ? "dirty" : ""}`}
                title={dirty ? "تغييرات غير محفوظة" : "الحساب محفوظ"}
              />
            </div>

            <div className="fw-lux-hero-ornament" aria-hidden="true">
              <div className="fw-lux-ring ring-a" />
              <div className="fw-lux-ring ring-b" />
              <div className="fw-lux-ring ring-c" />
              <div className="fw-lux-center-gem">
                <Icon name="shield" />
              </div>
            </div>
          </div>

          <div className="fw-lux-section-grid">
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                className="fw-lux-section-card"
                style={{ "--i": index }}
                onClick={() => setActive(section.id)}
              >
                <div className="fw-lux-card-top">
                  <span className="fw-lux-card-icon">
                    <Icon name={section.icon} />
                  </span>

                  <span className="fw-lux-card-arrow">
                    <Icon name="arrow-left" />
                  </span>
                </div>

                <div className="fw-lux-card-copy">
                  <strong>{section.label}</strong>
                  <p>{section.description}</p>
                </div>

                <div className="fw-lux-card-progress">
                  <span>
                    <i style={{ width: `${completeness[section.id]}%` }} />
                  </span>
                  <small>{completeness[section.id]}% مكتمل</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <main className="fw-lux-detail fw-lux-view-in">
          <div className="fw-lux-detail-toolbar">
            <button
              type="button"
              className="fw-lux-back"
              onClick={() => setActive(null)}
            >
              <Icon name="arrow-right" />
              <span>العودة للأقسام</span>
            </button>

            <span className={`fw-lux-state-pill ${dirty ? "dirty" : ""}`}>
              <span />
              {dirty ? "تغييرات غير محفوظة" : "الحالة محفوظة"}
            </span>
          </div>

          <div className="fw-lux-detail-shell">
            <section className="fw-lux-form-panel">
              <div className="fw-lux-form-head">
                <span>ACCOUNT SETTINGS</span>
                <h3>{current.label}</h3>
                <p>{detailSubtitle(active)}</p>
              </div>

              <div className="fw-lux-form-body">
                {active === "profile" && (
                  <ProfileSection
                    form={form}
                    setField={setField}
                    avatar={avatar}
                    setAvatar={setAvatar}
                    fileRef={fileRef}
                    uploadAvatar={uploadAvatar}
                  />
                )}

                {active === "contact" && (
                  <ContactSection form={form} setField={setField} />
                )}

                {active === "personal" && (
                  <PersonalSection form={form} setField={setField} />
                )}

                {active === "security" && (
                  <SecuritySection
                    form={form}
                    setField={setField}
                    show={show}
                    setShow={setShow}
                  />
                )}
              </div>

              <footer className="fw-lux-form-footer">
                <button
                  type="button"
                  className="fw-lux-btn fw-lux-btn-ghost"
                  disabled={!dirty || saveMutation.isPending}
                  onClick={cancel}
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  className="fw-lux-btn fw-lux-btn-primary"
                  disabled={!dirty || saveMutation.isPending}
                  onClick={save}
                >
                  <span>
                    {saveMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </span>
                  <Icon name="check" />
                </button>
              </footer>
            </section>
          </div>
        </main>
      )}
    </section>
  );
}

export default SettingsPage;