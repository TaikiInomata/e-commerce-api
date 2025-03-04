import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import deepmerge from 'deepmerge'

const baseDoc = JSON.parse(fs.readFileSync('./src/docs/swagger.json', 'utf8'))
const productDoc = JSON.parse(fs.readFileSync('./src/docs/productDoc.json', 'utf8'))

const swaggerDocument = deepmerge.all([baseDoc, productDoc])

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

export default swaggerDocs