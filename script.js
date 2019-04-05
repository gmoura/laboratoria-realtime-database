window.onload = () => {
  const database = firebase.database();
  const form = document.querySelector('.cadastro');
  const alunosList = document.querySelector('.alunos');
  const collectionAlunos = database.ref('alunos');

  function dataBaseRegisterNewUser (email, name, cordao) {
    database.ref(`alunos`).push({
      email,
      name,
      cordao
    })
    .then( () => console.log(`Aluno ${name} inserido com sucesso`));
  }

  function dataBaseEditUser(key, name) {
    database.ref(`alunos/${key}`).update({
      name,
    })
  }

  function alunoTemplate (key, { email, name, cordao }) {
   return `
    <li class="alunos--list" data-key=${key}>
      <div>
        <strong>Nome:</strong> <span class="aluno-name-text">${name}</span>
        <input class="aluno-name-input" type="text" />
      </div>
      <strong>Email:</strong> ${email} <br />
      <strong>Cordão:</strong> ${cordao} <br />
      <span class="aluno-edit" data-key=${key}>Editar</span>
    </li>`; 
  }

  function editName (key) {
    const item = document.querySelector(`[data-key=${key}]`);
    const text = item.querySelector('.aluno-name-text');
    const input = item.querySelector('.aluno-name-input')
    
    input.value = text.textContent;
    text.style.display = 'none';
    input.style.display = 'inline-block';

    input.addEventListener('blur', (event) => {
      const value = event.target.value;
      dataBaseEditUser(key, value)
    })
  }

  function addHandlerToEdit () {
    const itens = document.querySelectorAll('.aluno-edit');

    itens.forEach(element => {
      element.addEventListener('click', (event) => {
        const key = event.target.getAttribute('data-key');
        editName(key)
      })
    })
  }

  //form listener
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const cordao = document.querySelector('input[name="cordao"]').value;

    dataBaseRegisterNewUser(email, name, cordao);
  })

  //Realtime database listener 
  collectionAlunos.on('value', function(snapshot) {
    const alunos = snapshot.val();
    alunosList.innerHTML = '';
    if(!alunos) return;
    Object.keys(alunos).forEach(key => {
      alunosList.innerHTML += alunoTemplate(key, alunos[key])
    });

    addHandlerToEdit();

  });
}