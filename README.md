Título: Plataforma de Curadoria e Busca de Serviços para Barbearias Locais
Este projeto consiste em uma aplicação web front-end dinâmica desenvolvida utilizando HTML5, CSS3 e JavaScript ES6+, cujo objetivo é centralizar e organizar informações detalhadas sobre as barbearias na cidade de Patos de Minas/MG.

🎯 Objetivo Principal
O objetivo é fornecer aos usuários uma ferramenta intuitiva e altamente funcional para descobrir, comparar e localizar serviços de cuidado masculino, melhorando significativamente a experiência de busca por prestadores de serviço locais.

⚙️ Arquitetura e Funcionalidades Técnicas
Estrutura de Dados: Os dados das 54 barbearias são gerenciados de forma externa em um arquivo JSON, garantindo que a aplicação seja escalável e fácil de atualizar sem modificar a lógica principal.

Renderização Dinâmica (JavaScript): O JavaScript é responsável por carregar o JSON (utilizando fetch e async/await), processar os dados e renderizar dinamicamente a galeria de cards (Grid).

Filtragem e Busca Avançada: A interface inclui um sistema robusto de filtragem baseado em critérios como:

Busca por Texto: Filtro em tempo real por nome ou endereço.

Filtro Rápido: Seleção por faixas de avaliação (ex: "Acima de 4.5 estrelas").

Filtro por Serviços: Filtragem multicritério baseada em serviços extras (servicosExtra).

Ordenação: Capacidade de ordenar a galeria por preço e avaliação (melhor ranqueada).

Interação e Usabilidade (UX):

Modal de Detalhes: O clique no card principal abre um modal (pop-up) que exibe informações completas (descrição, lista de serviços) de forma não intrusiva.

Integração com Maps: O endereço (localizacao) em todos os cards e no modal é um link interativo e clicável que redireciona o usuário diretamente para a pesquisa no Google Maps, facilitando a navegação.

Design Responsivo: A estrutura (index.html e style.css) foi projetada para ser completamente responsiva, garantindo uma visualização e funcionalidade consistentes em dispositivos móveis (Mobile-First Approach) e desktops.

📈 Conclusão
Este projeto demonstra a capacidade de construir uma solução full-featured e orientada a dados, focada em resolver um problema prático do usuário através da combinação eficiente de HTML, CSS e JavaScript.
