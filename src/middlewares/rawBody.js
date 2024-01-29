export const rawBodyMiddleware = (req, res, next) => {
  req.setEncoding('utf8');
  req.body = ''; // Inicializa o corpo da solicitação como uma string vazia
  req.on('data', chunk => {
    req.body += chunk;
  });
  req.on('end', next);
};
