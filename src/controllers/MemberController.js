import User from "../models/User.js"
import Member from "../models/Member.js"
import RecentActivity from "../models/RecentActivity.js"
import {v4 as uuidv4} from 'uuid'


export const getMembers = async (req, res) => {
    
    const userId = req._id // Obtendo o ID do usuário logado
    
    if (!userId) {
        return res.status(400).json({ msg: 'ID do usuário não fornecido.' })
    }

    try {
        const members = await Member.find({ user: userId })
        return res.status(200).json(members)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: 'Erro ao obter seus membros.', error: err })
    }
}

export const getMember = async (req, res) => {

    const MemberId = req.params.id
    
    const member = await Member.findById({_id: MemberId})

    return res.json({member})
}

export const createMember = async (req, res) => {
    const userId = req._id // Obtendo o ID do usuário logado
    const member = {
        name: req.body.name,
        gender: req.body.gender,
        adress: req.body.adress,
        cell_number: req.body.cell_number,
        bday: req.body.bday,
        role: req.body.role,
        baptized: req.body.baptized,
        member_since: req.body.member_since,
        files: req.files.map(file => ({
            filename: file.key, // Usando `file.key` para o nome do arquivo no S3
            size: file.size,
            url: file.location, // `file.location` é a URL retornada pelo S3
            uuid: uuidv4() // Gerando um ID único para o arquivo
        })),
        user: userId
    }

    try {
        const newMember = await Member.create(member)

        const newMemberActivity = new RecentActivity({
            type: 'Member',
            itemId: newMember._id,
            user: userId,
            name: newMember.name,
            date: newMember.createdAt
        })

        // Salvar a atividade recente do membro no banco de dados
        await newMemberActivity.save()

        // Atualizar o usuário com a referência para a atividade recente
        await User.findByIdAndUpdate(userId, { $push: { members: newMember._id, recentActivities: newMemberActivity._id } })
        return res.status(201).json({ msg: `Membro cadastrado para a igreja cujo id é: ${userId}`, newMember })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ msg: 'Erro ao cadastrar membro', err })
    }
}


export const deleteMember = async (req, res) => {

    const id = req.params.id

    await Member.findByIdAndDelete({_id: id})
    await RecentActivity.findOneAndDelete({ type: 'Member', itemId: id })

    return res.status(200).json({res: 'Membro e suas inforamções deletadas com sucesso.'})
}

export const updateMember = async (req, res) => {
    try {
        // Check if the member exists
        const member = await Member.findById(req.params.id)
        if (!member) {
            return res.status(404).json({ msg: 'Membro não encontrado' })
        }

        // Atualiza apenas os campos presentes no corpo da requisição
        const newData = {}
        if (req.body.name) newData.name = req.body.name
        if (req.body.gender) newData.gender = req.body.gender
        if (req.body.birthday) newData.birthday = req.body.birthday
        if (req.body.address) newData.address = req.body.address
        if (req.body.cell_number) newData.cell_number = req.body.cell_number
        if (req.body.role) newData.role = req.body.role
        if (req.body.baptized) newData.baptized = req.body.baptized
        if (req.body.member_since) newData.member_since = req.body.member_since

        // Handle image update if provided in the request
        if (req.files && req.files.length > 0) {
            // Assuming only one image is updated
            const file = req.files[0]
            newData.files = {
                filename: file.key, // Usando `file.key` para o nome do arquivo no S3
                size: file.size,
                url: file.location, // `file.location` é a URL retornada pelo S3
            }
        }

        // Salva as alterações no banco de dados
        const updatedMember = await Member.findByIdAndUpdate(member._id, newData, { new: true })

        return res.status(200).json(updatedMember)
    } catch (err) {
        return res.status(500).json({ msg: 'Erro ao atualizar membro', error: err.message })
    }
}
