import User from "../models/User.js"
import Member from "../models/Member.js";


export const getMembers = async (req, res) => {
    
    const userId = req._id; // Obtendo o ID do usuário logado
    
    if (!userId) {
        return res.status(400).json({ msg: 'ID do usuário não fornecido.' });
    }

    try {
        const members = await Member.find({ user: userId });
        return res.status(200).json(members);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Erro ao obter seus membros.', error: err });
    }
}

export const getMember = async (req, res) => {

    const MemberId = req.params.id
    
    const member = await Member.findById({_id: MemberId})

    return res.json({member})
}

export const createMember = async (req, res) => {
    const userId = req._id; // Obtendo o ID do usuário logado
    const member = {
        name: req.body.name,
        adress: req.body.adress,
        cell_number: req.body.cell_number,
        bday: req.body.bday,
        role: req.body.role,
        files: req.files.map(file => ({
            filename: file.filename,
            size: file.size,
            url: `uploads/${file.filename}`, // Crie a URL baseada no nome do arquivo
        })),
        user: userId
        }

    try {
        const newMember = await Member.create(member);
        
        await User.findByIdAndUpdate(userId, { $push: { members: newMember._id } });
        return res.status(201).json({msg: `Membro cadastrado para a igreja cujo id é: ${userId}`, newMember});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Erro ao cadastrar membro', err });
    }
}

export const deleteMember = async (req, res) => {

    const id = req.params.id

    await Member.findByIdAndDelete({_id: id})

    return res.status(200).json({res: 'Membro e suas inforamções deletadas com sucesso.'})
}

export const updateMember = async (req,res) => {
    try {
    const id = req.params.id
    
    const member = {
        name: req.body.name,
        adress: req.body.adress,
        cell_number: req.body.cell_number,
        bday: req.body.bday,
        role: req.body.role,
        files: req.files.map(file => ({
            filename: file.filename,
            size: file.size,
            url: `uploads/${file.filename}`, // Crie a URL baseada no nome do arquivo
        })),
        }
    await Member.findByIdAndUpdate(id, {member})

    return res.status(200).json({res: 'Informações do membro atualizadas com sucesso!'})

    } catch(error){ 
        res.status(400).json({res: 'Deu errado a atualização'})
    }

}