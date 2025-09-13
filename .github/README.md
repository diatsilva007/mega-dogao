<h1 align="center">
  Mega Dogão Carioca 🌭
</h1>

<p align="center">
  <img alt="Status do Projeto" src="http://img.shields.io/static/v1?label=STATUS&message=CONCLUIDO&color=GREEN&style=for-the-badge"/>
  <img alt="Licença" src="https://img.shields.io/static/v1?label=LICENSE&message=MIT&color=informational&style=for-the-badge"/>
</p>
 
<p align="center">
  <img src="https://github.com/diatsilva007/cardapio/blob/main/readme-files/images/Dev%3BBurguer.gif" alt="Demonstração do Projeto Mega Dogão Carioca" width="1280" height="350">
</p>
 
## 🚀 Sobre o Projeto

O **Mega Dogão Carioca** é uma aplicação web de cardápio online desenvolvida para uma lanchonete fictícia. O projeto permite que os clientes visualizem o menu, montem seus pedidos, preencham informações de entrega e finalizem a compra, que é enviada diretamente para o WhatsApp do estabelecimento.

Além da integração com o WhatsApp, cada pedido é registrado automaticamente em uma planilha do Google Sheets, servindo como um sistema de gerenciamento de pedidos simples e eficaz, sem a necessidade de um banco de dados complexo.

### ✨ Principais Funcionalidades

- **Status de Funcionamento Dinâmico:** Exibe "Aberto" ou "Fechado" com base no horário configurado, desabilitando a adição de itens quando o estabelecimento está fechado.
- **Cardápio Interativo:** Produtos listados com nome, descrição, preço e botão para adicionar ao carrinho.
- **Carrinho de Compras:** Modal para visualizar os itens, ajustar quantidades, remover produtos e ver o valor total.
- **Checkout Completo:** Formulário para nome, endereço detalhado (rua, número, bairro, complemento, referência) e observações.
- **Múltiplas Formas de Pagamento:** Opções de Dinheiro (com cálculo de troco), PIX (com chave visível e botão para copiar) e Cartão na Entrega.
- **Integração com WhatsApp:** Ao finalizar, o pedido é formatado e enviado para a API do WhatsApp, abrindo uma conversa com a mensagem pronta para ser enviada.
- **Registro de Pedidos no Google Sheets:** Envia os dados do pedido (ID, cliente, itens, total, endereço, etc.) para uma planilha, servindo como um backend de controle.
- **Notificações e Feedback:** Uso de toasts para informar o usuário sobre ações (item adicionado, carrinho vazio, etc.).
- **Totalmente Responsivo:** Design adaptado para desktops, tablets e smartphones.
- **Animações Modernas:** Efeitos de _fade-in_ e _scroll_ para uma experiência de usuário mais agradável.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

#### **Frontend**
- **HTML5**
- **CSS3**
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS para estilização rápida e responsiva.
- **JavaScript (Vanilla)** - Para toda a lógica de interatividade e manipulação do DOM.

#### **Bibliotecas e Integrações**
- **[Toastify.js](https://github.com/apvarun/toastify-js)** - Para notificações e alertas.
- **[Font Awesome](https://fontawesome.com/)** - Para os ícones.
- **[Google Apps Script](https://www.google.com/script/start/)** - Para salvar os pedidos em uma planilha Google Sheets.
- **API do WhatsApp** - Para o envio dos pedidos.
 
## 💻 Demonstração ao Vivo

Você pode acessar e testar o projeto em produção no seguinte link:

➡️ **[https://mega-dogao.vercel.app/](https://mega-dogao.vercel.app/)**

## ⚙️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto em sua máquina.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/diatsilva007/mega-dogao.git
   ```
2. **Navegue até o diretório do projeto:**
   ```bash
   cd mega-dogao
   ```
3. **Instale as dependências de desenvolvimento (Tailwind CSS):**
   ```bash
   npm install
   ```
4. **Inicie o compilador do Tailwind CSS em modo de observação:**
   ```bash
   npm run dev
   ```
5. **Abra o arquivo `index.html` no seu navegador.**
   - Recomenda-se usar a extensão Live Server do VS Code para ter recarregamento automático das alterações.

## 🔧 Configuração

Para personalizar a aplicação para o seu próprio negócio, você precisará editar algumas constantes no arquivo `script.js`:

- `WHATSAPP_ORDER_PHONE_NUMBER`: Altere para o número de WhatsApp que receberá os pedidos (formato internacional, ex: `5511999998888`).
- `PIX_KEY_VALUE`: Defina a chave PIX que será exibida para o cliente.
- `operatingHours`: Ajuste os horários de funcionamento do seu estabelecimento.
- `GOOGLE_SCRIPT_URL`: Substitua pela URL do seu script do Google Apps Script para registrar os pedidos.

### Como configurar o Google Apps Script

1. Crie uma nova **Planilha Google**.
2. Vá em `Extensões > Apps Script`.
3. Cole o código do script que recebe os dados do pedido via `POST`.
4. **Implante** o script como um aplicativo da web, concedendo acesso anônimo para que o `fetch` funcione.
5. Copie a URL da implantação e cole-a na constante `GOOGLE_SCRIPT_URL` em seu `script.js`.
 
## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

<h3 align="center">
  Feito com ❤️ por Diogo Ataide Silva
</h3>

<p align="center">
| <img src="https://avatars.githubusercontent.com/u/143373573?v=4" width="100" height="100"><br><sub>Diogo Ataide</sub>
| :---: |
</p>

