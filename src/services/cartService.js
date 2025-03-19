/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { cartModel } from '~/models/cartModel'
import { productModel } from '~/models/productModel'
import { productTypeModel } from '~/models/productTypeModel'
import ApiError from '~/utils/ApiError'

const getCart = async (buyerId) => {
  try {
    const result = await cartModel.getCart(buyerId)
    const fullProducts = []
    for (let item of result.itemList) {
      const productDetail = await productModel.findOneById(item.productId)
      const productType = await productTypeModel.findOneByProductId(item.productId)
      fullProducts.push({
        ...productDetail,
        type: productType?.types?.find(type => type.typeId.toString() === item.typeId.toString())
      })
    }
    return { ...result, fullProducts }
  } catch (error) { throw error }
}

const addToCart = async (buyerId, reqBody) => {
  try {
    const existCart = await cartModel.findOneByBuyerId(buyerId)

    if (!existCart) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Giỏ hàng không hợp lệ')

    const itemList = existCart.itemList
    const { productId, typeId, quantity } = reqBody

    let isExistedItem = false
    itemList.forEach(item => {
      if (!isExistedItem && item.productId.toString() === productId && item.typeId.toString() === typeId) {
        item.quantity += quantity
        isExistedItem = true
      }
    })
    if (!isExistedItem) itemList.push({ productId: new ObjectId(productId), typeId: new ObjectId(typeId), quantity })

    const result = await cartModel.updateItemLists(buyerId, itemList)
    return result
  } catch (error) { throw error }
}

export const cartService = {
  getCart,
  addToCart
}