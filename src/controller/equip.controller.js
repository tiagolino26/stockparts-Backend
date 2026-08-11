import equipRepository from "../repository/equip.repository.js";

const equipController = {

  // GET
  async get() {

    return await equipRepository.get();

  },


  // POST - criar equipamento
  async createEquipamento(request) {

    return await equipRepository.createEquipamento(
      request.body
    );

  },


  // PUT - editar equipamento
  async updateEquipamento(request) {

    const { id } = request.params;

    return await equipRepository.updateEquipamento(
      Number(id),
      request.body
    );

  },


  // DELETE - excluir equipamento
  async deleteEquipamento(request) {

    const { id } = request.params;

    return await equipRepository.deleteEquipamento(
      Number(id)
    );

  },


  // POST - criar peça
  async createPeca(request) {

    return await equipRepository.createPeca(
      request.body
    );

  },


  // PUT - editar peça
  async updatePeca(request) {

    const { id } = request.params;

    return await equipRepository.updatePeca(
      Number(id),
      request.body
    );

  },


  // DELETE - excluir peça
  async deletePeca(request) {

    const { id } = request.params;

    return await equipRepository.deletePeca(
      Number(id)
    );

  },


  // PUT - acrescentar estoque
  async acrescentarPeca(request) {

    const { id } = request.params;

    return await equipRepository.acrescentarPeca(
      Number(id)
    );

  },


  // PUT - retirar estoque
  async retirarPeca(request) {

    const { id } = request.params;

    return await equipRepository.retirarPeca(
      Number(id)
    );

  }

};

export default equipController;