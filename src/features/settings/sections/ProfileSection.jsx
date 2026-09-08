import { LuxField } from "@/shared/components/LuxField";

export function ProfileSection({
  form,
  setField,
  avatar,
  setAvatar,
  fileRef,
  uploadAvatar,
}) {
  return (
    <div className="fw-lux-form-grid">
      <div className="fw-lux-profile-showcase fw-lux-span-2">
        <div className="fw-lux-avatar-stage">
          <div className="fw-lux-avatar-halo" />
          <div className="fw-lux-avatar-large">
            {avatar ? (
              <img src={avatar} alt="الصورة الشخصية" />
            ) : (
              <span>{(form.fullName || "م").charAt(0)}</span>
            )}
          </div>
          <span className="fw-lux-avatar-badge">✓</span>
        </div>

        <div className="fw-lux-profile-meta">
          <span>PROFILE IMAGE</span>
          <h3>الصورة الشخصية</h3>
          <p>استخدم صورة واضحة ومميزة لحسابك.</p>

          <div className="fw-lux-profile-actions">
            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="fw-lux-mini-action"
            >
              تغيير الصورة
            </button>

            <button
              type="button"
              onClick={() => setAvatar(null)}
              className="fw-lux-mini-action danger"
            >
              حذف
            </button>
          </div>
        </div>
      </div>

      <LuxField
        icon="user"
        label="الاسم الكامل"
        value={form.fullName}
        onChange={(v) => setField("fullName", v)}
        placeholder="أدخل الاسم الكامل"
      />

      <LuxField
        icon="at"
        label="اسم المستخدم"
        value={form.username}
        onChange={(v) => setField("username", v)}
        placeholder="username"
        dir="ltr"
      />
    </div>
  );
}