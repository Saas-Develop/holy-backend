import jwt from "jsonwebtoken";

export const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado' });
    }

    try {
        const secret = "e";

        jwt.verify(token, secret, async (err, user) => {
            if (err) {
                return res.status(403).json({ msg: 'Token inválido' });
            }
            try {
                if (!user) {
                    return res.status(404).json({ msg: 'Usuário não encontrado' });
                }
                // Adiciona as informações do usuário ao objeto 'req'
                req._id = user.sub;
                next();
            } catch (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Erro ao buscar usuário no banco de dados' });
            }
        });
    } catch (err) {
        res.status(400).json({ msg: 'Erro ao verificar o token' });
    }
};