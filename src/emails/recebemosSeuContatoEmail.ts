interface IRecebemosSeuContatoEmailParams {
  nomeCliente: string
}

const RecebemosSeuContatoEmail = ({
  nomeCliente,
}: IRecebemosSeuContatoEmailParams) => {
  return `
		<body>
			<div>
				<p>Ola <strong>${nomeCliente}</strong>, espero que esteja bem!</p>
				<p>
					Esse email serve para notifica-lo que recebemos sua solicitacao de
					contato, e te enviaremos mensagem logo logo!
				</p>
				<br />
				<br />
				<p>Atenciosamente, equipe CodeUi.</p>
			</div>
		</body>
	`
}

export default RecebemosSeuContatoEmail
