## Dependências

- [NodeJS >= v10.16.0](https://nodejs.org/download/release/v0.10.16/)

## Instalação

1. Instale o NodeJS
2. Vá até a pasta do projeto
3. Execute o comando ``npm install``
4. Configure a porta do webserver no *package.json*

## Scripts

- ``npm start`` 
	- Executa a versão de produção
- ``npm run dev``
	- Executa a versão de desenvolvimento

## API

### **``/caso``** 

Descrição: **Retorna os casos cadastrados no banco de dados**

Metodo: **GET**

Parametros Opicionais:
 
- *``data_notificacao``*
- *``sexo``*
- *``idade``*
- *``estado``*
- *``cep``*
- *``internacao``*
- *``evolucao``*
- *``uti``*

Toda busca pode ser feita utilizando os seguintes operadores:
``>``  ``>=`` ``<`` ``<=`` ``=``

Exemplos: 

- ``/casos?data_notificacao=>2020/01/01`` 
	- Retorna todos casos após 01/01/2020
- ``/casos?estado=MG`` 
	- Retorna todos os casos de Minas Gerais
- ``/casos?sexo=1`` 
	- Retorna todos os casos de pacientes masculinos
- ``/casos?sexo=2&evolucao=2`` 
	- Retorna todos os casos de pacientes femininos e recuperados
- ``/casos?data_notificacao=>=2020/03/01&data_notificacao=<=2020/04/01&idade=>20&idade=<30`` 
	- Retorna todos os casos entre 01/03/2020 e 01/04/2020 de pacientes com idade superior a 20 e inferior a 30
	
___

### ``/produtos``

Descrição: **Retorna os produtos cadastrados no bando**

Metodo: **GET**

Parametros Opicionais:
 
- *``loja``*
- *``nome``*
- *``status``*
- *``preco``*
- *``categoria``*

Toda busca pode ser feita utilizando os seguintes operadores:
``>``  ``>=`` ``<`` ``<=`` ``=``

Exemplos: 

- ``/produtos?preco=<50.10`` 
	- Retorna todos os produtos com preço menor que R$50,10
- ``/casos?status=1&preco=<20`` 
	- Retorna todos os produtos disponiveis e com preco menor que R$20,00 
- ``/produtos?categoria=Alcool`` 
	- Retorna todos os produtos relacionados à Álcool
- ``/produtos?categoria=Mascara&loja=Araujo`` 
	- Retorna todas as mascaras da Araujo




## Estrutura do banco de dados

### Tabela ``casos``

| Nome        		| Tipo     	| Descrição  								| Valores																			|
| ---------------- 	|----------	| ----------------------------------------	|--------------------------------------------------------------------------------	|
|id					|int		|Identificador no nosso bando de dados		| [0-9] 																			|
|identificador		|int		|Identificador em outros bancos de dados	| [0-9] 																			|
|data_notificacao	|timestamp	|Data de notificação do caso				| yyyy-mm-dd hh:mm:ss 																|
|data_atualizacao	|timestamp	|Data de atualização no banco de dados 		|yyyy-mm-dd hh:mm:ss 																|
|sexo				|tinyint	|Sexo										|**0**: Não informado; **1**: Masculino; **2**: Feminino;							|
|idade				|tinyint	|Idade										|**-1**: Não informado; **>= 0**: Idade;											|
|estado				|char		|Sigla do estado							|**"NA"**: Não informado; **"A-Z"**: Estado;										|
|municipio			|varchar	|Nome do municipio							|**"NA"**: Não informado; **[A-Za-z]**: Estado;										|
|cep				|int		|CEP										|**-1**: Não informado; **>= 0**: Cep												|
|internacao			|tinyint	|Paciente foi internado						|**0**: Não informado; **1**: Sim; **2**: Não;										|
|evolucao			|tinyint	|Evoluçao do paciente						|**0**: Não informado; **1**: Em acompanhamento; **2**: Recuperado; **3**: Obito;	|
|uti				|tinyint	|Paciente usou uti							|**0**: Não informado; **1**: Sim; **2**: Não;										|


### Tabela ``produtos``

| Nome        		| Tipo    	| Descrição  								| Valores																			|
| ----------------	|---------	| ----------------------------------------	| --------------------------------------------------------------------------------	|
|id					|int		|Identificador no nosso bando de dados		| [0-9]			 																	|
|loja				|int		|Identificador em outros bancos de dados	| [0-9] 																			|
|nome				|timestamp	|Data de notificação do caso				| yyyy-mm-dd hh:mm:ss 																|
|imagem				|timestamp	|Data de atualização no banco de dados 		| yyyy-mm-dd hh:mm:ss 																|
|status				|tinyint	|Sexo										|**0**: Não informado; **1**: Masculino; **2**: Feminino;							|
|preco				|tinyint	|Idade										|**-1**: Não informado; **>= 0**: Idade;											|
|url				|char		|Sigla do estado							|**"NA"**: Não informado; **"A-Z"**: Estado;										|
|data_atualizacao	|varchar	|Nome do municipio							|**"NA"**: Não informado; **[A-Za-z]**: Estado;										|
|categoria			|int		|CEP										|**-1**: Não informado; **>= 0**: Cep												|
|internacao			|tinyint	|Paciente foi internado						|**0**: Não informado; **1**: Sim; **2**: Não;										|
|evolucao			|tinyint	|Evoluçao do paciente						|**0**: Não informado; **1**: Em acompanhamento; **2**: Recuperado; **3**: Obito;	|
|uti				|tinyint	|Paciente usou uti							|**0**: Não informado; **1**: Sim; **2**: Não;										|
