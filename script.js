const Modal = {
    open(){
        // abrir modal
        // adicionar a classe active ao modal
        document.querySelector('.modal-overlay')
        .classList.add('active')
    },
    close(){
        // Fechar o modal
        // remover a classe active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}



const Transaction = {
    all: [{
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        description: 'website',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        description: 'Internet',
        amount: 20000,
        date: '23/01/2021',
    },
    {
        description: 'app',
        amount: 200000,
        date: '23/01/2021',
    }],

    add(transaction){
        transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    // somar as entradas
    incomes() {
        // primeiro passocriar uma variavel
        // Pegar todas as transações
        let income = 0;
        // Para cada transação
        Transaction.all.forEach(transaction => {
            // se a transação for maior que zero
            if(transaction.amount > 0 ){
                // somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })

        return income;
    },
    // somar as saidas
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0 ){
                expense += transaction.amount;
            }
        })

        return expense;

    },
    // total = entradas - saidas
    total() {
        return Transaction.incomes() + Transaction.expenses()

    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação">
            </td>
            
            `

            return html
    }, 
    updateBalance() {
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }


}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, ""))
        return value
    },

    formatDate(date) {
        const splitedDate = date.split("-")
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    },
    formatCurrency(value){
        const signal = Number(value)  < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('date'),

    getValues() {
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    validateFields(){
         // Verificar se todas as informações foram preenchidas
        const { description, amount, date } = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description, 
            amount, 
            date
        }
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },
    submit(event){
        event.preventDefault()

        try {
            Form.validateFields() 
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
            
        } catch (error) {
            alert(error.message)
        }      

    }
}

const App = {
    init() {
        Transaction.all.forEach(transaction, index => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()