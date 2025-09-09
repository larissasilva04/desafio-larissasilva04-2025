class AbrigoAnimais {
    constructor() {
        this.animais = {
            'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
            'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
            'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
            'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
            'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
            'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
            'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
        };
    }

    encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
        try {
            const brinquedos1 = brinquedosPessoa1.split(',').map(b => b.trim().toUpperCase());
            const brinquedos2 = brinquedosPessoa2.split(',').map(b => b.trim().toUpperCase());
            const animaisOrdem = ordemAnimais.split(',').map(a => a.trim());

            if (this.temDuplicatas(brinquedos1) || this.temDuplicatas(brinquedos2)) {
                return { erro: 'Brinquedo inválido' };
            }

            if (this.temDuplicatas(animaisOrdem)) {
                return { erro: 'Animal inválido' };
            }

            for (const animal of animaisOrdem) {
                if (!animal || animal === '' || !this.animais[animal]) {
                    return { erro: 'Animal inválido' };
                }
            }

            const resultado = [];

            for (const nomeAnimal of animaisOrdem) {
                const animal = this.animais[nomeAnimal];
                
                const compativel1 = this.verificarCompatibilidade(animal.brinquedos, brinquedos1, animal.tipo);
                const compativel2 = this.verificarCompatibilidade(animal.brinquedos, brinquedos2, animal.tipo);

                if (compativel1 && compativel2) {
                    resultado.push(`${nomeAnimal} - abrigo`);
                } else if (compativel1) {
                    resultado.push(`${nomeAnimal} - pessoa 1`);
                } else if (compativel2) {
                    resultado.push(`${nomeAnimal} - pessoa 2`);
                } else {
                    resultado.push(`${nomeAnimal} - abrigo`);
                }
            }

            resultado.sort((a, b) => {
                const nomeA = a.split(' - ')[0];
                const nomeB = b.split(' - ')[0];
                return nomeA.localeCompare(nomeB);
            });

            return { lista: resultado };

        } catch (error) {
            return { erro: 'Animal inválido' };
        }
    }

    verificarCompatibilidade(brinquedosAnimal, brinquedosPessoa, tipoAnimal) {
        for (const brinquedo of brinquedosAnimal) {
            if (!brinquedosPessoa.includes(brinquedo)) {
                return false;
            }
        }

        let ultimoIndice = -1;
        for (const brinquedo of brinquedosAnimal) {
            const indice = brinquedosPessoa.indexOf(brinquedo);
            if (indice <= ultimoIndice) {
                return false; 
            }
            ultimoIndice = indice;
        }

        return true;
    }

    temDuplicatas(array) {
        return new Set(array).size !== array.length;
    }
}

export { AbrigoAnimais as AbrigoAnimais };