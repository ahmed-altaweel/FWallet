import {
    initialize,
    getUserData,
    updateUserData
} from "@/shared/utils/mock/MockStore";

/* =========================================================
   Available Providers
   ========================================================= */

export const PROVIDERS = [
    {
        id: "alkuraimi",
        name: "بنك الكريمي",
        icon: "bank",
        description: "حساب مصرفي متوافق مع أحكام الشريعة الإسلامية."
    },
    {
        id: "jaib",
        name: "جيب",
        icon: "wallet",
        description: "محفظة إلكترونية سريعة للتحويلات اليومية."
    },
    {
        id: "alrajhi",
        name: "مصرف الراجحي",
        icon: "bank",
        description: "حساب بنكي بعمليات محلية ودولية موسّعة."
    }
];


/* =========================================================
   Supported Currencies
   ========================================================= */

export const CURRENCIES = [
    { code: "YER", name: "ريال يمني" },
    { code: "SAR", name: "ريال سعودي" },
    { code: "USD", name: "دولار أمريكي" }
];


/* =========================================================
   Get Providers Available For Linking
   ========================================================= */

export async function getProviders() {

    await new Promise(resolve =>
        setTimeout(resolve, 400)
    );

    return PROVIDERS;
}


/* =========================================================
   Connect A New Account
   ========================================================= */

export async function connectAccount(token, payload) {

    const {
        providerId,
        accountNumber,
        iban,
        currency
    } = payload;


    const provider = PROVIDERS.find(
        item => item.id === providerId
    );

    if (!provider) {
        throw { message: "المزود المالي المحدد غير متاح." };
    }

    if (!accountNumber || !accountNumber.trim()) {
        throw { message: "يرجى إدخال رقم الحساب." };
    }

    if (!currency) {
        throw { message: "يرجى اختيار عملة الحساب." };
    }


    await initialize(
        "accounts",
        "accountsData.json"
    );

    /* محاكاة زمن الاتصال بالمزود لجلب/تسجيل بيانات الحساب */
    await new Promise(resolve =>
        setTimeout(resolve, 900)
    );


    const accounts =
        getUserData("accounts", token) || [];


    const isDuplicate = accounts.some(
        account =>
            account.provider === provider.name &&
            account.accountNumber === accountNumber
    );

    if (isDuplicate) {
        throw {
            message: "هذا الحساب مرتبط لديك بالفعل ضمن هذا المزود."
        };
    }


    const newAccount = {
        id: `acc-${Date.now()}`,
        provider: provider.name,
        accountNumber,
        iban: iban || "",
        currency,
        balance: 0,
        amount: 0,
        status: "active",
        synchrouns: true,
        lastSync: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };


    updateUserData(
        "accounts",
        token,
        [...accounts, newAccount]
    );


    return newAccount;
}