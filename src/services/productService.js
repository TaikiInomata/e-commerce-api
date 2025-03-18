import { productModel } from '~/models/old-productModel'
import { DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
import { slugify } from '~/utils/formatters'

/* eslint-disable no-useless-catch */
const getProducts = async (page, itemsPerPage, queryFilters) => {
  try {
    if (!page) page = 1
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await productModel.getProducts(page, itemsPerPage, queryFilters)
    return results
  } catch (error) { throw error }
}

const createProduct = async (reqBody) => {
  try {
    const createdProduct = await productModel.createProduct({ ...reqBody, slug: slugify(reqBody.name) })
    return createdProduct
  } catch (error) { throw error }
}

const getDetails = async (productId) => {
  try {
    const product = await productModel.getDetails(productId)
    return product
  } catch (error) { throw error }
}

export const productService = {
  getProducts,
  createProduct,
  getDetails
}