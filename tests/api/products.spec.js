const request = require('supertest')
const app = require('../../src/app')
const mongoose = require('mongoose')

const Product = require('../../src/models/product.model')

describe('Api de products', () => {

    beforeAll(async () => {
        //Conexión a la BD
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online')
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe('Pruebas GET /api/products', () => {

        let response
        beforeAll(async () => {
            response = await request(app).get('/api/products').send();
        })

        it('La url /api/products existe', () => {
            expect(response.statusCode).toBe(200)
        })

        it('la respuesta debe ser en formato JSON', () => {
            expect(response.headers['content-type']).toContain('application/json')
        })
        it('la respuesta debe ser un array', () => {
            expect(response.body).toBeInstanceOf(Array)
        })
    })

    describe('Pruebas POST /api/products', () => {

        const body = {
            name: 'Producto prueba',
            description: 'Esto es una prueba estupenda',
            price: 120,
            department: 'test',
            available: true,
            stock: 30
        }
        let response
        beforeAll(async () => {
            response = await request(app).post('/api/products').send(body)
        })

        afterAll(() => {
            Product.deleteMany({ department: 'test' })
        })


        it('debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200)
            expect(response.header['content-type']).toContain('application/json')
        })

        it('deberia incluir el _id en el bodyd e la respuesta', () => {
            expect(response.body._id).toBeDefined()
        })
    })

    describe('Pruebas Put /api/products', () => {
        const body = {
            name: 'Producto prueba',
            description: 'Esto es una prueba estupenda',
            price: 120,
            department: 'test',
            available: true,
            stock: 30
        }
        let response
        let newProduct

        beforeAll(async () => {
            // En la BD creamos el producto a modificar
            newProduct = await Product.create(body)
            // lanzamos la petición de PUT
            response = await request(app).put(`/api/products/${newProduct._id}`).send({
                price: 300,
                department: 'Salchichapapa'
            })
        })

        afterAll(async () => {
            await Product.findByIdAndDelete(newProduct._id)
        })

        it('debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200)
            expect(response.header['content-type']).toContain('application/json')
        })

        it('debería responder con los cambios', () => {
            expect(response.body.price).toBe(300)
            expect(response.body.department).toBe('Salchichapapa')
        })
    })

    describe('Pruebas DELETE /api/products', () => {
        const body = {
            name: 'Producto prueba',
            description: 'Esto es una prueba estupenda',
            price: 120,
            department: 'test',
            available: true,
            stock: 30
        }
        let response
        let newProduct

        beforeAll(async () => {
            //crear producto a borrar
            newProduct = await Product.create(body)
            //Lanzo la peticion
            response = await request(app).delete(`/api/products/${newProduct._id}`).send()
        })

        it('debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200)
            expect(response.header['content-type']).toContain('application/json')
        })

        it('Deberia desaparecer el producto de la BD', async () => {
            const product = await Product.findById(newProduct._id)
            expect(product).toBeNull()
        })
    })
})