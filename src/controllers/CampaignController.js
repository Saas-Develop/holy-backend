import User from "../models/User.js"
import Campaign from "../models/Campaign.js"


export const getCampaigns = async (req, res) => {
    const userId = req._id

    if (!userId) {
        return res.status(400).json({ msg: 'ID do usuário não fornecido.' })
    }

    try {
        const campaigns = await Campaign.find({ user: userId })
        return res.status(200).json(campaigns)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: 'Erro ao obter transações.', error: err })
    }
}

export const getCampaign = async (req, res) => {
    const campaignId = req.params.id

    const campaign = await Campaign.findById({ _id: campaignId })

    return res.json({ campaign })
}

export const createCampaign = async (req, res) => {
    const userId = req._id

    const campaign = {
        description: req.body.description,
        category: req.body.category,
        value: req.body.value,
        date: req.body.date,
        user: userId
    }

    try {
        const newCampaign = await Campaign.create(campaign)

        await User.findByIdAndUpdate(userId, { $push: { campaigns: newCampaign._id } })
        return res.status(201).json({ msg: 'Campanha cadastrada com sucesso.', newCampaign })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ msg: 'Erro ao cadastrar campanha.', err })
    }
}

export const deleteCampaign = async (req, res) => {
    const id = req.params.id

    try {
        const campaign = await Campaign.findByIdAndDelete({ _id: id })

        if (!campaign) {
            return res.status(404).json({ msg: 'Campanha não encontrada.' })
        }

        await User.findByIdAndUpdate(campaign.user, { $pull: { campaigns: id } })

        return res.status(200).json({ res: 'Campanha deletada com sucesso.' })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ msg: 'Erro ao deletar campanha.', err })
    }
}

export const updateCampaign = async (req, res) => {
    const id = req.params.id
    const { type, deduction } = req.body

    try {
        const campaign = await Campaign.findById({_id: id})
        if (!campaign) {
            return res.status(404).json({ msg: 'Campanha não encontrada.' })
        }

        const deductionValue = parseFloat(deduction)
        if (isNaN(deductionValue)) {
            return res.status(400).json({ msg: 'Valor de dedução inválido.' })
        }

        if (type === 'income') {
            campaign.deduction = parseFloat(campaign.deduction) + deductionValue
        } else if (type === 'expense') {
            campaign.deduction = parseFloat(campaign.deduction) - deductionValue
        } else {
            return res.status(400).json({ msg: 'Tipo de transação inválido.' })
        }

        await campaign.save()
        return res.status(200).json({ msg: 'Informações da campanha atualizadas com sucesso!', campaign })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: 'Erro na atualização da campanha.', error })
    }
}

