async function enviarCadastroSeguro(dadosCadastro) {
    try {
        const client = getSupabaseClient();
        
        const { data, error } = await client
            .from('fila_cadastros')
            .insert([{
                cpf: dadosCadastro.login?.cpf || dadosCadastro.cpf || '00000000000',
                dados_json: dadosCadastro,
                status: 'PENDENTE'
            }]);
        
        if (error) {
            throw new Error(error.message);
        }
        
        return { success: true, message: 'Cadastro enviado para processamento' };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

if (typeof window !== 'undefined') {
    window.enviarCadastroSeguro = enviarCadastroSeguro;
}