const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')
const cors = require('cors')

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false})) //dados simples
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }
    
    next()
})

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)

//Quando não encontra rota
app.use((use, res, next) => {
    const erro = new Error('Não Encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})
module.exports = app