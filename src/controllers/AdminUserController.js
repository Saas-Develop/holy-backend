import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import AdminUser from "../models/AdminUser.js";
import User from '../models/User.js';

export const getAdminUsers = async (req, res) => {

    const users = await AdminUser.find()

    return res.status(200).json(users)
}

export const getAdminUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await AdminUser.findById(id, '-password');
  
      if (!user) {
        return res.status(404).json({ msg: 'Administrador não encontrado' });
      }
  
      res.status(200).json({
        user,
        subscriptionStatus: user.subscription, // Certifique-se de ajustar isso conforme necessário
      });
    } catch (err) {
      console.error('Erro ao obter administrador:', err.message);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };

  export const createAdminUser = async (req, res) => {
    try {
      // Encode password in DB
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(req.body.password, salt);

      const user = {
        email: req.body.email,
        password: passwordHash,
        name: req.body.name,
        role: req.body.role,
        // customerId: customer,
      };
  
      // Your existing validations...
      if (!user.name) {
        return res.status(422).json({ msg: 'Diga seu nome!' });
      }
      if (!user.email) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
      }
      if (!user.password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
      }
      if (!user.role) {
        return res.status(422).json({ msg: 'O cargo é obrigatório' });
      }
  
      const userExists = await AdminUser.findOne({ email: req.body.email });
  
      if (userExists) {
        return res.status(422).json({ msg: 'Este e-mail já está registrado, tente fazer login ou use outro e-mail' });
      }

      
      const newUser = await AdminUser.create(user);

      return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ msg: 'Erro ao criar conta administrativa', msg: err.message });
    }
  };

  export const loginAdminUser = async (req, res) => {
    const user = {email: req.body.email, password: req.body.password}
    //Validação de email e senha

    if(!user.email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }
    if(!user.password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    // Checa se o usuário existe
    const findUser = await AdminUser.findOne({email: req.body.email})

    if(!findUser){
        return res.status(404).json({msg: 'Administrador não encontrado'})
    }
    // Checa se as senhas combinam
    const checkPassword = await bcrypt.compare(req.body.password, findUser.password)
    
    if (!checkPassword){
        return res.status(422).json({msg: 'Senha inválida'})
    }

    try{

        //Cria o token passando o secret como assinatura única
        const secret = process.env.SECRET
        const token = jwt.sign({sub: findUser._id}, secret)
        // , { expiresIn: '30m' }

        res.status(200).json({msg: 'Administrador logado com sucesso no token', token, user, name: findUser.name, id: findUser._id})
        
    } catch (err) {
        res.status(500).json({msg: 'Ocorreu um erro ao logar'})
    } 
}

export const deleteAdminUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Encontrar o usuário no banco de dados
        const user = await AdminUser.findById({_id: userId});

        if (!user) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }

        // Deletar o usuário no banco de dados
        await AdminUser.findByIdAndDelete({_id: userId});

        return res.status(200).json({ res: 'Administrador e seus dados deletados' });
    } catch (err) {
        console.error('Erro ao deletar administrador:', err.message);
        return res.status(500).json({ error: 'Erro interno' });
    }
};

export const updateUserSubscription = async (req, res) => {
  const id = req.params.id;
  const subscription = req.body.subscription;

  try {
      const user = await User.findById({_id: id});
      if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      user.subscription = subscription;
      await user.save();

      return res.status(200).json({ message: 'Subscription atualizado com sucesso', user });
  } catch (error) {
      console.error('Erro ao atualizar a subscription do usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};