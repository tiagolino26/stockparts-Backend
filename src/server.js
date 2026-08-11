import "dotenv/config";

// importação da biblioteca fastify
import Fastify from "fastify";
import cors from "@fastify/cors";

// importação das rotas de equipamentos
import equipRoutes from "./routes/equip.routes.js";

const fastify = Fastify({
  logger: true,
});

// CORS para conectar com o frontend.
await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE"],
});

// Registro das rotas dos equipamentos
await fastify.register(equipRoutes, {
  prefix: "/equip",
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return `servidor rodando na porta 3000`;
});

// Run the server!
try {
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
