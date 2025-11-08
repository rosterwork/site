async function enviarCadastroSeguro(dadosCadastro) {
    try {
        const client = getSupabaseClient();
        
        const { data, error } = await client
            .from('fila_cadastros')
            .insert([{
                dados_json: dadosCadastro,
                status: 'pendente',
                criado_em: new Date().toISOString()
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