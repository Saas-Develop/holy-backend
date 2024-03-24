import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import Campaign from "../models/Campaign.js"

dotenv.config()

export const getUsers = async (req, res) => {

    const users = await User.find()

    return res.status(200).json(users)
}

export const privateGetUser = async (req, res) => {
    const id = req.params.id;
    const campaigns = await Campaign.find({ user: id });
  
    try {
      const user = await User.findById(id, '-password');
  
      if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }
  
      res.status(200).json({
        user: {
          id: user._id,
          church_name: user.church_name,
          email: user.email,
          // customerId: user.customerId,
        },
        campaigns,
        subscriptionStatus: user.subscription, // Certifique-se de ajustar isso conforme necessário
      });
    } catch (err) {
      console.error('Erro ao obter usuário:', err.message);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };

  export const createUser = async (req, res) => {
    try {
      // Encode password in DB
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
  
      // Check if the email already exists in Stripe
      // const stripeCustomer = await getCustomerByEmail(req.body.email);
  
      // if (stripeCustomer) {
      //   return res.status(422).json({ msg: 'Este e-mail já está registrado, tente fazer login ou use outro e-mail' });
      // }
  
      // Create a new customer in Stripe
      // const customer = await addNewCustomer(req.body.email, req.body.name);
  
      const user = {
        church_name: req.body.church_name,
        email: req.body.email,
        password: passwordHash,
        // customerId: customer,
      };
  
      // Your existing validations...
      if (!user.church_name) {
        return res.status(422).json({ msg: 'O nome da igreja obrigatório' });
      }
      if (!user.email) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
      }
      if (!user.password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
      }
  
      const userExists = await User.findOne({ email: req.body.email });
  
      if (userExists) {
        return res.status(422).json({ msg: 'Este e-mail já está registrado, tente fazer login ou use outro e-mail' });
      }
  
      const newUser = await User.create(user);
      return res.status(201).json(newUser);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ msg: 'Erro ao criar conta', msg: err.message });
    }
  };

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Encontrar o usuário no banco de dados
        const user = await User.findById({_id: userId});

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Deletar o cliente no Stripe
        // if (user.customerId) {
        //     await stripe.customers.del(user.customerId);
        // }

        // Deletar o usuário no banco de dados
        await User.findByIdAndDelete({_id: userId});

        return res.status(200).json({ res: 'Usuário e seus dados deletados' });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err.message);
        return res.status(500).json({ error: 'Erro interno' });
    }
};

export const loginUser = async (req, res) => {
    const user = {email: req.body.email, password: req.body.password}
    //Validação de email e senha

    if(!user.email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }
    if(!user.password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    // Checa se o usuário existe
    const findUser = await User.findOne({email: req.body.email})

    if(!findUser){
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }
    // Checa se as senhas combinam
    const checkPassword = await bcrypt.compare(req.body.password, findUser.password)
    
    if (!checkPassword){
        return res.status(422).json({msg: 'Senha inválida'})
    }

    //   Checa se o usuário tem uma subscrição ativa
    // if (!findUser.subscription || findUser.subscription.status !== 'active') {
    //     return res.status(403).json({ msg: 'Usuário sem subscrição ativa' });
    // }

    try{

        //Cria o token passando o secret como assinatura única
        const secret = process.env.SECRET
        const token = jwt.sign({sub: findUser._id}, secret)
        // , { expiresIn: '30m' }

        res.status(200).json({msg: 'Usuário logado com sucesso no token', token, user, church_name: findUser.church_name, id: findUser._id, subscriptionStatus: findUser.subscription})
        
    } catch (err) {
        res.status(500).json({msg: 'Ocorreu um erro ao logar'})
    } 
}

export const refreshToken = async (req, res) => {
    const userId = req._id;

    try {
        // Verifica se o usuário existe procurando pelo ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Gera um novo token de acesso
        const secret = process.env.SECRET;
        const newAccessToken = jwt.sign({ sub: user._id, subscriptionStatus: findUser.subscription}, secret);

        // Atualiza o novo token de acesso no usuário mantendo os dados
        user.token = newAccessToken;
        await user.save();

        // Responde com o novo token de acesso
        return res.status(200).json({msg: 'Token gerado com sucesso!', newToken: newAccessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro ao renovar o token' });
    }
};



