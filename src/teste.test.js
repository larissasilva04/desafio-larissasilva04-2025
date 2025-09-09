import { AbrigoAnimais } from "./abrigo-animais.js";

describe('Testes Extras - Casos Extremos e Validações', () => {
    let abrigo;

    beforeEach(() => {
        abrigo = new AbrigoAnimais();
    });

    // ===== TESTES DE ROBUSTEZ =====
    describe('Robustez e Casos Extremos', () => {
        test('Deve lidar com strings vazias', () => {
            const resultado = abrigo.encontraPessoas('', '', '');
            expect(resultado.erro).toBe('Animal inválido');
        });

        test('Deve lidar com espaços em branco', () => {
            const resultado = abrigo.encontraPessoas('   ', '   ', '   ');
            expect(resultado.erro).toBe('Animal inválido');
        });

        test('Deve lidar com múltiplas vírgulas consecutivas', () => {
            const resultado = abrigo.encontraPessoas('RATO,,BOLA', 'RATO,NOVELO', 'Rex');
            expect(resultado.erro || resultado.lista).toBeDefined();
        });

        test('Deve ser case-sensitive para nomes de animais', () => {
            const resultado = abrigo.encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'rex');
            expect(resultado.erro).toBe('Animal inválido');
        });

        test('Deve aceitar case-insensitive para brinquedos', () => {
            const resultado = abrigo.encontraPessoas('rato,bola', 'RATO,NOVELO', 'Rex');
            expect(resultado.lista).toBeDefined();
            expect(resultado.lista[0]).toContain('Rex - pessoa 1');
        });
    });

    // ===== TESTES DE LÓGICA DE COMPATIBILIDADE =====
    describe('Lógica de Compatibilidade Avançada', () => {
        test('Animal compatível com ambas pessoas deve ir para abrigo', () => {
            const resultado = abrigo.encontraPessoas('BOLA,RATO,LASER', 'BOLA,RATO,LASER', 'Fofo');
            expect(resultado.lista[0]).toBe('Fofo - abrigo');
        });

        test('Animal incompatível com ambas deve ir para abrigo', () => {
            const resultado = abrigo.encontraPessoas('CAIXA', 'NOVELO', 'Rex');
            expect(resultado.lista[0]).toBe('Rex - abrigo');
        });

        test('Ordem dos brinquedos deve importar na compatibilidade', () => {
            const resultado1 = abrigo.encontraPessoas('RATO,BOLA', 'LASER', 'Rex');
            const resultado2 = abrigo.encontraPessoas('BOLA,RATO', 'LASER', 'Rex');
            
            expect(resultado1.lista[0]).toBe('Rex - pessoa 1');
            expect(resultado2.lista[0]).toBe('Rex - abrigo');
        });
    });

    // ===== TESTES COM MÚLTIPLOS ANIMAIS =====
    describe('Múltiplos Animais - Cenários Complexos', () => {
        test('Deve processar e ordenar múltiplos animais corretamente', () => {
            const resultado = abrigo.encontraPessoas(
                'RATO,BOLA,LASER', 
                'CAIXA,NOVELO', 
                'Zero,Bola,Rex'
            );
            
            expect(resultado.lista).toHaveLength(3);
            expect(resultado.lista[0]).toContain('Bola -');
            expect(resultado.lista[1]).toContain('Rex -');
            expect(resultado.lista[2]).toContain('Zero -');
        });

        test('Cenário com todos os tipos de animais', () => {
            const resultado = abrigo.encontraPessoas(
                'RATO,BOLA,LASER', 
                'SKATE,RATO', 
                'Rex,Mimi,Loco'
            );
            
            expect(resultado.lista).toHaveLength(3);
            expect(resultado.lista[0]).toContain('Loco - pessoa 2'); 
            expect(resultado.lista[1]).toContain('Mimi - pessoa 1');
            expect(resultado.lista[2]).toContain('Rex - pessoa 1');
        });
    });

    // ===== TESTES DE PERFORMANCE =====
    describe('Performance e Limites', () => {
        test('Deve processar lista longa de animais', () => {
            const todosAnimais = 'Rex,Mimi,Fofo,Zero,Bola,Bebe,Loco';
            const inicio = performance.now();
            
            const resultado = abrigo.encontraPessoas(
                'RATO,BOLA,LASER,CAIXA,NOVELO,SKATE', 
                'LASER,RATO,BOLA', 
                todosAnimais
            );
            
            const tempo = performance.now() - inicio;
            
            expect(resultado.lista).toHaveLength(7);
            expect(tempo).toBeLessThan(100);
        });
    });

    // ===== TESTES DE VALIDAÇÃO DE DUPLICATAS =====
    describe('Validação de Duplicatas', () => {
        test('Deve rejeitar brinquedos duplicados na pessoa 1', () => {
            const resultado = abrigo.encontraPessoas('RATO,RATO', 'BOLA', 'Rex');
            expect(resultado.erro).toBe('Brinquedo inválido');
        });

        test('Deve rejeitar brinquedos duplicados na pessoa 2', () => {
            const resultado = abrigo.encontraPessoas('RATO', 'BOLA,BOLA', 'Rex');
            expect(resultado.erro).toBe('Brinquedo inválido');
        });

        test('Deve rejeitar animais duplicados', () => {
            const resultado = abrigo.encontraPessoas('RATO,BOLA', 'LASER', 'Rex,Rex');
            expect(resultado.erro).toBe('Animal inválido');
        });

        test('Deve aceitar mesmo brinquedo em pessoas diferentes', () => {
            const resultado = abrigo.encontraPessoas('RATO,BOLA', 'RATO,LASER', 'Rex');
            expect(resultado.lista).toBeDefined();
        });
    });

    // ===== TESTES DE INTEGRIDADE DOS DADOS =====
    describe('Integridade dos Dados do Abrigo', () => {
        test('Deve manter dados dos animais inalterados após múltiplas consultas', () => {
            const animaisOriginais = JSON.stringify(abrigo.animais);
            
            abrigo.encontraPessoas('RATO,BOLA', 'LASER', 'Rex');
            abrigo.encontraPessoas('BOLA,LASER', 'RATO', 'Mimi');
            abrigo.encontraPessoas('SKATE,RATO', 'CAIXA', 'Loco');
            
            expect(JSON.stringify(abrigo.animais)).toBe(animaisOriginais);
        });

        test('Deve ter todos os animais esperados no banco de dados', () => {
            const animaisEsperados = ['Rex', 'Mimi', 'Fofo', 'Zero', 'Bola', 'Bebe', 'Loco'];
            const animaisExistentes = Object.keys(abrigo.animais);
            
            expect(animaisExistentes.sort()).toEqual(animaisEsperados.sort());
        });

        test('Deve ter tipos corretos para cada animal', () => {
            expect(abrigo.animais.Rex.tipo).toBe('cão');
            expect(abrigo.animais.Mimi.tipo).toBe('gato');
            expect(abrigo.animais.Loco.tipo).toBe('jabuti');
        });
    });

    // ===== TESTE DE DOCUMENTAÇÃO =====
    describe('Documentação e Exemplos', () => {
        test('Exemplo da documentação deve funcionar corretamente', () => {
            const resultado = abrigo.encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
            
            expect(resultado.lista).toContain('Fofo - abrigo');
            expect(resultado.lista).toContain('Rex - pessoa 1');
            expect(resultado.lista).toHaveLength(2);
        });
    });
});