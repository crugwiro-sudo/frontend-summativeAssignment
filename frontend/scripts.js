const STORAGE_KEY = 'summatice-transactions';

const dialog = document.querySelector("#transaction-dialog");
const openButton = document.querySelector("#add-transaction-btn")
const cancelButton = document.querySelector("#cancel-btn");
const transactionForm = document.querySelector("#transaction-form");
const monthInput = document.querySelector("#month")
const incomeList = document.querySelector(".income-list")
const expenseList = document.querySelector(".expense-list")
const storageMessage = document.querySelector("#storage-message");
const remainingBalance = document.querySelector("#remaining-balance")
const totalIncome = document.querySelector("#total-income");
const totalExpenses = document.querySelector("#total-expenses");
const descriptionRegex = /^(?!.*\s{2})\s(?:.*\S)?$/;
const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2]) - (0[1-9]|[12]\d|3[01])$/;
const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
const duplicateWordRegex = /\b(\w+)\s+\1\b/i;
const searchInput = document.querySelector("#transaction-search")
const searchStatus = document.querySelector("#search-status")


const today = new Date();
monthInput.value = 
    `${today.getFullYear()}-${String(today.getMonth() +1).padStart(2, "0")}`;

let transactions = [];
let storageReady = true;

function showMessage(message){
    storageMessage.textContent = message;

}


// function isValidDate(value){
//     if(!DUPPLICATE_WORD_RE.test(value))
// }

function isTransaction(value){
    return(
        value &&
        typeof value.id === "string" &&
        (value.type === "income" || value.type === "expense") &&
        Number.isFinite(value.amount) &&
        typeof value.description === "string" &&
        typeof value.category === "string" &&
        typeof value.date === "string" &&
        typeof value.notes === "string"
    );
}

function loadTransactions(){
            try{
                const savedTransactions = localStorage.getItem(STORAGE_KEY)

                if (savedTransactions === null){
                    return [];
                }

                const parsedTransasctions = JSON.parse(savedTransactions);

                if(
                    !Array.isArray(parsedTransasctions) ||
                    !parsedTransasctions.every(isTransaction)
                ) {
                    throw new Error("Saved transaction data has an invalid format.");
                }
                return parsedTransasctions;
            }
            catch(error){
                storageReady = false;
                console.error("Could not load saved transactions:", error)
                showMessage("Could not load saved Transactions. Check the browser console.");
                return [];
            }
        }
        function renderTransactions(){
            incomeList.replaceChildren();
            expenseList.replaceChildren();

            const selectedMonth = monthInput.value;
            const visibleTransactions = transactions.filter((transactions) =>
                transactions.date.startsWith(selectedMonth)
        );

        let searchRegex;

        try{
            searchRegex = searchInput.value
            ? new RegExp(searchInput.value, "i")
            : null;
            searchStatus.textContent = "";
        }
        catch{
            searchStatus.textContent = "Invalid regex Pattern.";
            searchRegex = null;
        }

        const searchedTransactions = searchRegex
        ? visibleTransactions.filter((transactions)=>
            searchRegex.test(
                `${transactions.description} ${transactions.category} ${transactions.notes}`
            )
        )
        : visibleTransactions
        

        // if (visibleTransactions.length === 0){
        //     const emptyMessage = document.createElement("li");
        //     emptyMessage.textContent = "No transactions for this month.";
        //     transactionList.append(emptyMessage);
        //     return;
        // }

        // for (const transactions of visibleTransactions){
        //     const item = document.createElement("li");
        //     const title = document.createElement("strong");
        //     const details = document.createElement("p");

        //     title.textContent = 
        //     `${transactions.type === "income" ? "Income" : "Expense"}:` +
        //     `${transactions.description} - ${transactions.amount.toFixed(2)}`

        //     details.textContent = 
        //     `${transactions.date} . ${transactions.category}` +
        //     (transactions.notes ? ` . ${transactions.notes}` : "");

        //     item.append(title, details);
        //     transactionList.append(item);
        // }

        const incomeTransactions = searchedTransactions.filter(
            (transactions) => transactions.type === "income"
        );
        const expenseTransactions = searchedTransactions.filter(
            (transactions) => transactions.type === "expense"
        );

    function renderList(list, items, emptyMessage){
        if(items.length === 0){
            const emptyItem = document.createElement("li");
            emptyItem.textContent = emptyMessage;
            list.append(emptyItem);
            return
        }
        for(const transaction of items){
            const item = document.createElement("li");
            const title = document.createElement("strong")
            const details = document.createElement("p");

            title.textContent = 
            `${transaction.description} - ${transaction.amount.toFixed(2)}`;
            details.textContent = 
            `${transaction.date} . ${transaction.category}` +
            (transaction.notes ? ` . ${transaction.notes}` : "")

            item.append(title, details);
            list.append(item);
        }
    }
    renderList(incomeList, incomeTransactions, "No income this month.")
    renderList(expenseList,expenseTransactions, "No expenses this month");
        const income = visibleTransactions
        .filter((transactions) =>transactions.type === "income")
        .reduce((total, transactions)=> total + transactions.amount, 0);

        const expenses = visibleTransactions
        .filter((transactions) =>transactions.type === "expense")
        .reduce((total, transactions)=> total + transactions.amount, 0);

        const formatAmount = (amount) =>
            amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            totalIncome.textContent = formatAmount(income);
            totalExpenses.textContent = formatAmount(expenses);
            remainingBalance.textContent = formatAmount(income-expenses);

        }


    transactions = loadTransactions();
    renderTransactions();


openButton.addEventListener("click", () =>{
    dialog.showModal();   
})

cancelButton.addEventListener("click",() =>{
    dialog.close();
    transactionForm.reset();
})

dialog.addEventListener("click",(event) =>{
    if(event.target ==dialog){
        dialog.close();
        transactionForm.reset();

    }
})

monthInput.addEventListener("change", renderTransactions);
searchInput.addEventListener("input",renderTransactions);

transactionForm.addEventListener("submit",(event)=>{
    event.preventDefault();

    if(!storageReady){
        showMessage("Saving is disabled because saved transaction data could not be loaded.");
        return;
    }

    const formData = new FormData(transactionForm);
    const description = String(formData.get("description")).trim();
    const amount  = Number(formData.get("amount"));

    if(!description || !Number.isFinite(amount) || amount <= 0 ){
        showMessage("Enter a description and an amount greater than zero.");
        return;
    }

    const transaction = {
        id: `${Date.now()} - ${Math.random()}`,
        type:String(formData.get("transaction-type")),
        amount,
        description,
        category: String(formData.get("category")),
        date: String(formData.get("date")),
        notes: String(formData.get("notes")).trim(),

    };

    const updatedTransasctions = [transaction, ...transactions];
    
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransasctions));
        transactions =updatedTransasctions;
        renderTransactions();
        showMessage("Transaction saved.");
        dialog.close();
        transactionForm.reset();

    }
    catch(error){
        console.error("Could not save transaction", error)
        showMessage("Could not save the transaction. Check the browser console");

    }

});


