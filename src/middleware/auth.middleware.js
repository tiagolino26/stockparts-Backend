import jwt from "jsonwebtoken";

export async function verificarToken(request, reply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ erro: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    request.usuario = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return reply.status(401).send({ erro: "Token inválido ou expirado." });
  }
}
