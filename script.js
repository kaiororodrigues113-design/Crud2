'use strict'

// ================= MODAL E CRUD =================

const openModal = () => document.getElementById('modal').classList.add('active')
const closeModal = () => { clearFields(); document.getElementById('modal').classList.remove('active') }

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

const deleteClient = (index) => { const dbClient = readClient(); dbClient.splice(index, 1); setLocalStorage(dbClient) }
const updateClient = (index, client) => { const dbClient = readClient(); dbClient[index] = client; setLocalStorage(dbClient) }
const readClient = () => getLocalStorage()
const createClient = (client) => { const dbClient = getLocalStorage(); dbClient.push(client); setLocalStorage(dbClient) }

const isValidFields = () => document.getElementById('form').reportValidity()

const clearFields = () => {
    document.querySelectorAll('.modal-field').forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent = 'Novo Cliente'
}

const saveClient = () => {
    if (!isValidFields()) return
    const client = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('celular').value,
        cidade: document.getElementById('cidade').value
    }
    const index = document.getElementById('nome').dataset.index
    if (index === 'new') createClient(client)
    else updateClient(index, client)
    updateTable()
    closeModal()
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => { document.querySelectorAll('#tableClient>tbody tr').forEach(row => row.remove()) }
const updateTable = () => { const dbClient = readClient(); clearTable(); dbClient.forEach(createRow) }
const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    document.querySelector(".modal-header>h2").textContent = `Editando ${client.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type !== 'button') return
    const [action, index] = event.target.id.split('-')
    if (action === 'edit') editClient(index)
    else {
        const client = readClient()[index]
        if (confirm(`Deseja realmente excluir o cliente ${client.nome}?`)) {
            deleteClient(index)
            updateTable()
        }
    }
}

updateTable()

// ================= EVENTOS =================
document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveClient)
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)
document.getElementById('cancelar').addEventListener('click', closeModal)

// ================= SIMBIOSE (UI REAGE AO MOUSE) =================
document.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight

    // Fundo Venom se move suavemente
    document.body.style.background = `radial-gradient(circle at ${x*100}% ${y*100}%, #14001e 0%, #050009 60%, #000 100%)`

    // Glow de botões segue o mouse
    document.querySelectorAll('.button').forEach(btn => {
        const rect = btn.getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width/2)
        const dy = e.clientY - (rect.top + rect.height/2)
        const dist = Math.sqrt(dx*dx + dy*dy)
        const glow = Math.min(30, 150/dist)
        btn.style.boxShadow = `0 0 ${glow}px var(--neon-pink), 0 0 ${glow*2}px var(--venom-purple) inset`
    })
})
