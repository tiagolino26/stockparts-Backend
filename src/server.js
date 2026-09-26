import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

// suas rotas de sempre
import equipRoutes from "./routes/equip.routes.js";

// NOVO: rotas e middleware de autenticação
import authRoutes from "./routes/auth.routes.js";
import { verificarToken } from "./middleware/auth.middleware.js";

const fastify = Fastify({
  logger: true,
});

// CORS para conectar com o frontend (igual antes)
await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE"],
});

// NOVO: rotas públicas de login/registro (sem exigir token)
await fastify.register(authRoutes, {
  prefix: "/auth",
});

// ANTES: equipRoutes era registrado direto aqui, sem proteção
// AGORA: fica dentro de um bloco que exige token antes de deixar passar
await fastify.register(async function (protectedRoutes) {
  protectedRoutes.addHook("onRequest", verificarToken);
  await protectedRoutes.register(equipRoutes, {
    prefix: "/equip",
  });
});

// Declare a route (igual antes)
fastify.get("/", async function handler(request, reply) {
  return `servidor rodando na porta 3000`;
});

// Run the server! (com pequeno ajuste na porta, pra funcionar em produção depois)
try {
  await fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
