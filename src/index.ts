import express, {json,urlencoded} from 'express'
import productsRouter from './routes/products'
const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(json())
app.use(urlencoded({ extended: true }))

app.use("/products", productsRouter)

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})