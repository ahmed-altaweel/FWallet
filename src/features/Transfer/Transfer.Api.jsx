import { fetchData } from "../../shared/utils/FetchData";
import {
    initialize,
    getUserData,
    updateUserData,
    read,
    write
} from "../../shared/utils/mock/MockStore";


/* =========================================================
   Initialization
   ========================================================= */
export async function initializeTransferData(token) {
    await initialize(
        "accounts",
        "accountsData.json",
        token
    );

    await initialize(
        "transactions",
        "TransactionsData.json",
        token
    );

    await initialize(
        "transfers",
        "TransfersData.json",
        token
    );
}


/* =========================================================
   Accounts
   ========================================================= */
export async function getAccounts(token) {
    await initialize(
        "accounts",
        "accountsData.json",
        token
    );

    return getUserData(
        "accounts",
        token
    );
}


export async function getTransactions(token) {
    await initialize(
        "transactions",
        "TransactionsData.json",
        token
    );

    return getUserData(
        "transactions",
        token
    );
}

export async function getTransfers(token) {
    await initialize(
        "transfers",
        "TransfersData.json",
        token
    );

    return getUserData(
        "transfers",
        token
    );
}

export async function validateSingleTransfer(
    token,
    transferData
) {
    const accounts = await getAccounts(token);

    if (!Array.isArray(accounts)) {
        return {
            valid: false,
            code: "ACCOUNTS_UNAVAILABLE",
            message: "Unable to load accounts."
        };
    }

    const {
        sourceAccountId,
        destinationAccountId,
        amount
    } = transferData;


    const sourceAccount = accounts.find(
        account =>
            account.id === sourceAccountId
    );

    if (!sourceAccount) {
        return {
            valid: false,
            code: "SOURCE_NOT_OWNED",
            message:
                "Source account is not owned by the current user."
        };
    }


    const destinationAccount = accounts.find(
        account =>
            account.id === destinationAccountId
    );

    if (!destinationAccount) {
        return {
            valid: false,
            code: "DESTINATION_NOT_OWNED",
            message:
                "Destination account is not owned by the current user."
        };
    }


    if (
        sourceAccount.id ===
        destinationAccount.id
    ) {
        return {
            valid: false,
            code: "SAME_ACCOUNT",
            message:
                "Source and destination cannot be the same account."
        };
    }


    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return {
            valid: false,
            code: "INVALID_AMOUNT",
            message:
                "Amount must be greater than zero."
        };
    }


    if (sourceAccount.status !== "active") {
        return {
            valid: false,
            code: "SOURCE_ACCOUNT_INACTIVE",
            message:
                "Source account is not active."
        };
    }


    if (
        destinationAccount.status !==
        "active"
    ) {
        return {
            valid: false,
            code: "DESTINATION_ACCOUNT_INACTIVE",
            message:
                "Destination account is not active."
        };
    }


    return {
        valid: true,
        sourceAccount,
        destinationAccount,
        amount
    };
}



export async function validateMultiSourceTransfer(
    token,
    transferData
) {
    const accounts = await getAccounts(token);

    if (!Array.isArray(accounts)) {
        return {
            valid: false,
            code: "ACCOUNTS_UNAVAILABLE",
            message: "Unable to load accounts."
        };
    }

    const {
        destinationAccountId,
        sources
    } = transferData;


    const destinationAccount = accounts.find(
        account =>
            account.id === destinationAccountId
    );

    if (!destinationAccount) {
        return {
            valid: false,
            code: "DESTINATION_NOT_OWNED",
            message:
                "Destination account is not owned by the current user."
        };
    }


    if (destinationAccount.status !== "active") {
        return {
            valid: false,
            code: "DESTINATION_ACCOUNT_INACTIVE",
            message:
                "Destination account is not active."
        };
    }


    if (
        !Array.isArray(sources) ||
        sources.length === 0
    ) {
        return {
            valid: false,
            code: "NO_SOURCES",
            message:
                "At least one source account is required."
        };
    }


    const sourceIds =
        sources.map(
            source => source.accountId
        );


    if (
        new Set(sourceIds).size !==
        sourceIds.length
    ) {
        return {
            valid: false,
            code: "DUPLICATE_SOURCE",
            message:
                "The same source account cannot be used more than once."
        };
    }


    const validatedSources = [];


    for (const source of sources) {

        const account = accounts.find(
            item =>
                item.id === source.accountId
        );


        if (!account) {
            return {
                valid: false,
                code: "SOURCE_NOT_OWNED",
                message:
                    `Source account ${source.accountId} is not owned by the current user.`
            };
        }


        if (
            account.id ===
            destinationAccount.id
        ) {
            return {
                valid: false,
                code:
                    "SOURCE_EQUALS_DESTINATION",
                message:
                    "Source cannot be the destination account."
            };
        }


        if (account.status !== "active") {
            return {
                valid: false,
                code:
                    "SOURCE_ACCOUNT_INACTIVE",
                message:
                    `Source account ${account.id} is not active.`
            };
        }


        if (
            typeof source.amount !==
                "number" ||
            !Number.isFinite(
                source.amount
            ) ||
            source.amount <= 0
        ) {
            return {
                valid: false,
                code:
                    "INVALID_SOURCE_AMOUNT",
                message:
                    `Invalid amount for ${account.id}.`
            };
        }


        validatedSources.push({
            account,
            amount: source.amount
        });
    }


    const totalAmount =
        sources.reduce(
            (total, source) =>
                total + source.amount,
            0
        );


    return {
        valid: true,
        destinationAccount,
        sources: validatedSources,
        totalAmount
    };
}



export function createTransferRequest(
    token,
    transferData
) {
    return {
        id:
            `transfer-${Date.now()}`,

        token,

        type:
            transferData.type || "single",

        status: "pending",

        createdAt:
            new Date().toISOString(),

        source:
            transferData.source || null,

        sources:
            transferData.sources || [],

        destination:
            transferData.destination || null,

        requestedAmount:
            transferData.amount ||
            transferData.totalAmount ||
            0,

        requestedCurrency:
            transferData.requestedCurrency ||
            null,

        transactionIds: []
    };
}



export async function mockProviderTransfer(
    validation
) {
    await new Promise(resolve =>
        setTimeout(resolve, 800)
    );


    const {
        sourceAccount,
        destinationAccount,
        amount
    } = validation;


    if (
        sourceAccount.balance <
        amount
    ) {
        return {
            success: false,
            status: "failed",
            code:
                "INSUFFICIENT_BALANCE",
            message:
                "Provider rejected the transfer because of insufficient balance."
        };
    }


    return {
        success: true,

        status: "completed",

        providerReference:
            `PROV-${Date.now()}`,

        sourceAccountId:
            sourceAccount.id,

        destinationAccountId:
            destinationAccount.id,

        requestedAmount:
            amount,

        requestedCurrency:
            sourceAccount.currency,

        fee: 0,

        exchangeRate: 1,

        spread: 0,

        finalAmount:
            amount,

        finalCurrency:
            destinationAccount.currency
    };
}


export async function mockProviderMultiSourceTransfer(
    validation
) {
    await new Promise(resolve =>
        setTimeout(resolve, 800)
    );


    const results = [];


    for (
        const source of validation.sources
    ) {

        const {
            account,
            amount
        } = source;


        if (
            account.balance <
            amount
        ) {
            results.push({
                success: false,

                status: "failed",

                sourceAccountId:
                    account.id,

                requestedAmount:
                    amount,

                code:
                    "INSUFFICIENT_BALANCE",

                message:
                    "Provider rejected this source because of insufficient balance."
            });

            continue;
        }


        results.push({
            success: true,

            status: "completed",

            sourceAccountId:
                account.id,

            requestedAmount:
                amount,

            requestedCurrency:
                account.currency,

            providerReference:
                `PROV-${Date.now()}-${account.id}`,

            fee: 0,

            exchangeRate: 1,

            spread: 0,

            finalAmount:
                amount,

            finalCurrency:
                validation
                    .destinationAccount
                    .currency
        });
    }


    const successful =
        results.filter(
            result =>
                result.success
        ).length;


    const failed =
        results.length -
        successful;


    let status = "failed";


    if (
        successful ===
        results.length
    ) {
        status = "completed";
    }
    else if (successful > 0) {
        status = "partial";
    }


    return {
        success:
            successful > 0,

        status,

        results
    };
}



export function createTransactionRecords(
    transfer,
    providerResult
) {
    if (
        transfer.type === "single"
    ) {
        return [
            {
                id:
                    `transaction-${Date.now()}`,

                transferId:
                    transfer.id,

                type:
                    "transfer",

                status:
                    providerResult.status,

                amount:
                    providerResult.requestedAmount,

                currency:
                    providerResult.requestedCurrency,

                sourceAccountId:
                    providerResult.sourceAccountId,

                destinationAccountId:
                    providerResult.destinationAccountId,

                providerReference:
                    providerResult.providerReference,

                date:
                    new Date().toISOString()
            }
        ];
    }


    return providerResult.results.map(
        (result, index) => ({
            id:
                `transaction-${Date.now()}-${index}`,

            transferId:
                transfer.id,

            type:
                "transfer",

            status:
                result.status,

            amount:
                result.requestedAmount,

            currency:
                result.requestedCurrency,

            sourceAccountId:
                result.sourceAccountId,

            destinationAccountId:
                transfer
                    .destination
                    .accountId,

            providerReference:
                result.providerReference ||
                null,

            date:
                new Date().toISOString()
        })
    );
}


export async function saveTransfer(
    token,
    transfer
) {
    await initialize(
        "transfers",
        "TransfersData.json",
        token
    );

    const transfers =
        getUserData(
            "transfers",
            token
        ) || [];


    transfers.push(transfer);


    updateUserData(
        "transfers",
        token,
        transfers
    );


    return transfer;
}



export async function saveTransactions(
    token,
    transactions
) {
    await initialize(
        "transactions",
        "TransactionsData.json",
        token
    );

    const currentTransactions =
        getUserData(
            "transactions",
            token
        ) || [];


    currentTransactions.push(
        ...transactions
    );


    updateUserData(
        "transactions",
        token,
        currentTransactions
    );


    return transactions;
}



export async function updateAccountBalance(
    token,
    accountId,
    amount
) {
    await initialize(
        "accounts",
        "accountsData.json",
        token
    );

    const accounts =
        getUserData(
            "accounts",
            token
        ) || [];


    const accountIndex =
        accounts.findIndex(
            account =>
                account.id === accountId
        );


    if (accountIndex === -1) {
        throw new Error(
            "Account not found."
        );
    }


    accounts[accountIndex] = {
        ...accounts[accountIndex],

        balance:
            accounts[accountIndex]
                .balance - amount
    };


    updateUserData(
        "accounts",
        token,
        accounts
    );


    return accounts[accountIndex];
}
/* =========================================================
   Confirm Transfer
   ========================================================= */

export async function confirmTransfer(
    token,
    transferData
) {

    /* =========================================
       SINGLE
       ========================================= */

    if (
        transferData.type ===
        "single"
    ) {

        const validation =await validateSingleTransfer( token,transferData);
        console.log("Validation Result:", validation);

        if (!validation.valid) {
            throw new Error(
                validation.message
            );
        }


        const transfer =
            createTransferRequest(
                token,
                {
                    ...transferData,

                    source: {
                        accountId:
                            validation
                                .sourceAccount
                                .id,

                        amount:
                            transferData.amount,

                        currency:
                            validation
                                .sourceAccount
                                .currency
                    },

                    destination: {
                        accountId:
                            validation
                                .destinationAccount
                                .id,

                        currency:
                            validation
                                .destinationAccount
                                .currency
                    }
                }
            );

        
        const providerResult =
            await mockProviderTransfer(
                validation
            );

        console.log("Provider Result:", providerResult.success);
        if (!providerResult.success) {
            transfer.status =
                providerResult.status;

            await saveTransfer(
                token,
                transfer
            );

            console.log("Transfer confirmed -1:",transfer);
            return {
                transfer,
                providerResult,
                transactions: []
            };
        }

        
        const transactions =
            createTransactionRecords(
                transfer,
                providerResult
            );

        console.log("Transactions Created:", transactions);
        transfer.status =
            providerResult.status;


        transfer.transactionIds =
            transactions.map(
                transaction =>
                    transaction.id
            );


        await updateAccountBalance(
            token,
            validation
                .sourceAccount
                .id,
            transferData.amount
        );
        console.log("transfer after updateAccountBalance:",transfer);

        await saveTransactions(
            token,
            transactions
        );

        console.log("transfer after saveTransactions:",transfer);
        await saveTransfer(
            token,
            transfer
        );

        console.log("Transfer confirme after saveTransfer:",transfer);
        return {
            transfer,
            providerResult,
            transactions
        };
    }


    if (
        transferData.type ===
        "multi"
    ) {

        const validation =
            await validateMultiSourceTransfer(
                token,
                transferData
            );


        if (!validation.valid) {
            throw new Error(
                validation.message
            );
        }


        const transfer =
            createTransferRequest(
                token,
                {
                    ...transferData,

                    destination: {
                        accountId:
                            validation
                                .destinationAccount
                                .id,

                        currency:
                            validation
                                .destinationAccount
                                .currency
                    },

                    sources:
                        validation.sources.map(
                            source => ({
                                accountId:
                                    source
                                        .account
                                        .id,

                                amount:
                                    source.amount,

                                currency:
                                    source
                                        .account
                                        .currency
                            })
                        ),

                    totalAmount:
                        validation.totalAmount
                }
            );


        const providerResult =
            await mockProviderMultiSourceTransfer(
                validation
            );


        const transactions =
            createTransactionRecords(
                transfer,
                providerResult
            );


        transfer.status =
            providerResult.status;


        transfer.transactionIds =
            transactions.map(
                transaction =>
                    transaction.id
            );


        /*
         * Only successful source
         * operations affect balances.
         */

        for (
            const result
            of providerResult.results
        ) {

            if (
                result.success
            ) {

                await updateAccountBalance(
                    token,

                    result.sourceAccountId,

                    result.requestedAmount
                );
            }
        }


        await saveTransactions(
            token,
            transactions
        );


        await saveTransfer(
            token,
            transfer
        );


        return {
            transfer,
            providerResult,
            transactions
        };
    }


    throw new Error(
        "Unsupported transfer type."
    );
}


/* =========================================================
   Get Transfer
   ========================================================= */

export async function getTransfer(
    token,
    transferId
) {
    const transfers =
        await getTransfers(token);


    if (
        !Array.isArray(transfers)
    ) {
        return null;
    }


    return (
        transfers.find(
            transfer =>
                transfer.id ===
                transferId
        ) || null
    );
}


/* =========================================================
   Get Transfer Status
   ========================================================= */

export async function getTransferStatus(
    token,
    transferId
) {
    const transfer =
        await getTransfer(
            token,
            transferId
        );


    if (!transfer) {
        return {
            found: false,
            status: "not_found",
            transactions: []
        };
    }


    const transactions =
        await getTransactions(token);


    const transferTransactions =
        Array.isArray(transactions)
            ? transactions.filter(
                transaction =>
                    transaction.transferId ===
                    transferId
            )
            : [];


    return {
        found: true,

        transfer,

        transactions:
            transferTransactions,

        status:
            transfer.status
    };
}