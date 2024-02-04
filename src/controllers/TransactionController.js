import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import RecentActivity from "../models/RecentActivity.js";


export const getTransactions = async (req, res) => {
    const userId = req._id;

    if (!userId) {
        return res.status(400).json({ msg: 'ID do usuário não fornecido.' });
    }

    try {
        const transactions = await Transaction.find({ user: userId });
        return res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Erro ao obter transações.', error: err });
    }
}

export const getTransaction = async (req, res) => {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById({ _id: transactionId });

    return res.json({ transaction });
}

export const createTransaction = async (req, res) => {
    const userId = req._id;

    const transaction = {
        type: req.body.type,
        description: req.body.description,
        category: req.body.category,
        value: req.body.value,
        date: req.body.date,
        user: userId
    }

    try {
        const newTransaction = await Transaction.create(transaction);

        const newTransactionActivity = new RecentActivity({
            type: 'Transaction',
            transactionType: newTransaction.type,
            itemId: newTransaction._id,
            user: userId,
            description: newTransaction.description,
            value: newTransaction.value,
            createdAt: new Date()
        });

        // Salvar a atividade recente no banco de dados
        await newTransactionActivity.save();

        // Atualizar o usuário com a referência para a atividade recente
        await User.findByIdAndUpdate(userId, { $push: { transactions: newTransaction._id, recentActivities: newTransactionActivity._id } });
        return res.status(201).json({ msg: 'Transação cadastrada com sucesso.', newTransaction });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Erro ao cadastrar transação.', err });
    }
}

export const deleteTransaction = async (req, res) => {
    const id = req.params.id;

    await Transaction.findByIdAndDelete({ _id: id });
    await RecentActivity.findOneAndDelete({ type: 'Transaction', itemId: id });

    return res.status(200).json({ res: 'Transação deletada com sucesso.' });
}

export const updateTransaction = async (req, res) => {
    try {
        const id = req.params.id;

        const transaction = {
            type: req.body.type,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
            value: req.body.value
        }

        await Transaction.findByIdAndUpdate(id, transaction);

        return res.status(200).json({ res: 'Informações da transação atualizadas com sucesso!' });
    } catch (error) {
        res.status(400).json({ res: 'Erro na atualização da transação.' });
    }
}
