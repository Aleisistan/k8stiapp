function saludar() {
    let nombre = document.querySelector("#nombre").value
    let nodo = document.querySelector('#mensaje');
    nodo.innerHTML = 'Hola ' + nombre; 
  }