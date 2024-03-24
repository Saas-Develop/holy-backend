import User from "../models/User.js";
import Campaign from "../models/Campaign.js";


export const getCampaigns = async (req, res) => {
    const userId = req._id;

    if (!userId) {
        return res.status(400).json({ msg: 'ID do usuário não fornecido.' });
    }

    try {
        const campaigns = await Campaign.find({ user: userId });
        return res.status(200).json(campaigns);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Erro ao obter transações.', error: err });
    }
}

export const getCampaign = async (req, res) => {
    const campaignId = req.params.id;

    const campaign = await Campaign.findById({ _id: campaignId });

    return res.json({ campaign });
}

export const createCampaign = async (req, res) => {
    const userId = req._id;

    const campaign = {
        description: req.body.description,
        category: req.body.category,
        value: req.body.value,
        date: req.body.date,
        user: userId
    }

    try {
        const newCampaign = await Campaign.create(campaign);

        await User.findByIdAndUpdate(userId, { $push: { campaigns: newCampaign._id } });
        return res.status(201).json({ msg: 'Campanha cadastrada com sucesso.', newCampaign });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Erro ao cadastrar campanha.', err });
    }
}

export const deleteCampaign = async (req, res) => {
    const id = req.params.id;

    await Campaign.findByIdAndDelete({ _id: id });

    return res.status(200).json({ res: 'Campanha deletada com sucesso.' });
}

export const updateCampaign = async (req, res) => {
    try {
        const id = req.params.id;

        const campaign = {
            type: req.body.type,
            deduction: req.body.deduction,
        }

        await Campaign.findByIdAndUpdate(id, campaign);

        return res.status(200).json({ res: 'Informações da campanha atualizadas com sucesso!' });
    } catch (error) {
        res.status(400).json({ res: 'Erro na atualização da campanha.' });
    }
}
