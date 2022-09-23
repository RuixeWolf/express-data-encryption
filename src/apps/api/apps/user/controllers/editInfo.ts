import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import { verifyAesSignature } from '@/utils/aes'
import { Response, NextFunction } from 'express'
import { EditUserInfoRes, EditUserInfoReq, EditUserInfoFields, UserInfoDoc, EditUserInfoResData } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import { editInfo as editInfoView, editInfoStatusCodes } from '../views'

// Import status codes
const {
  EDIT_INFO_SUCCESS,
  USER_NOT_EXIST,
  INVALID_EMAIL,
  INVALID_PHONE,
  DATA_SIGNATURE_VERIFICATION_FAILED
} = editInfoStatusCodes

/**
 * Edit user info API handler version 1
 * @version v1
 * @param req - Express session request
 * @param res - Express response
 * @param next - Express next function
 */
async function editInfoV1 (req: SessionRequest, res: Response, next: NextFunction) {
  // 从会话信息获取用户 ID
  const userId: string = req.session.userId
  // 用户 ID 缺失
  if (!userId) {
    const resData: EditUserInfoRes = editInfoView(USER_NOT_EXIST)
    res.json(resData)
    return
  }

  // 获取需要需修改的用户信息
  const reqData: EditUserInfoReq = req.body

  /* 验证数字签名 */

  // 从请求头 Signature 字段获取数据签名
  const dataSignature = req.header('Signature')
  if (!dataSignature) {
    const resData: EditUserInfoRes = editInfoView(DATA_SIGNATURE_VERIFICATION_FAILED)
    res.json(resData)
    return
  }

  // 验证数字签名，判断数据是否被篡改
  const verifySignatureResult = verifyAesSignature({
    data: reqData as unknown as Record<string, unknown>,
    signature: dataSignature,
    aesSecretKey: req.session.clientAesKey
  })
  if (!verifySignatureResult) {
    const resData: EditUserInfoRes = editInfoView(DATA_SIGNATURE_VERIFICATION_FAILED)
    res.json(resData)
    return
  }

  /* 验证数据 */

  // 验证邮箱（非必填）
  const emailReg: RegExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
  if (reqData.email && !emailReg.test(reqData.email)) {
    const resData: EditUserInfoRes = editInfoView(INVALID_EMAIL)
    res.json(resData)
    return
  }

  // 验证手机号（非必填）
  const phoneNumReg: RegExp = /^1[3456789]\d{9}$/
  if (reqData.phone && !phoneNumReg.test(reqData.phone)) {
    const resData: EditUserInfoRes = editInfoView(INVALID_PHONE)
    res.json(resData)
    return
  }

  /* 处理修改用户信息事件 */

  // 生成需要更新的数据
  const currentTime: Date = new Date()
  const modifiedTime: string = currentTime.toISOString()
  const userInfoUpdateData: EditUserInfoFields = {
    modifiedTime
  }

  // 添加需要修改的字段
  if (reqData.nickName !== undefined) {
    userInfoUpdateData.nickName = reqData.nickName || null
  }
  if (reqData.avatar !== undefined) {
    userInfoUpdateData.avatar = reqData.avatar || null
  }
  if (reqData.email !== undefined) {
    userInfoUpdateData.email = reqData.email || null
  }
  if (reqData.phone !== undefined) {
    userInfoUpdateData.phone = reqData.phone || null
  }

  // 更新用户信息
  let userInfoUpdateRes: UserInfoDoc | null
  try {
    userInfoUpdateRes = await UserInfoModel.findOneAndUpdate(
      { userId },
      userInfoUpdateData,
      { new: true, useFindAndModify: false }
    ) as UserInfoDoc | null
  } catch (error) {
    next(error)
    return
  }

  // 用户不存在
  if (!userInfoUpdateRes) {
    const resData: EditUserInfoRes = editInfoView(USER_NOT_EXIST)
    res.json(resData)
    return
  }

  // 生成修改后的用户信息响应数据
  const editUserInfoResData: EditUserInfoResData = {
    userId: userInfoUpdateRes.userId,
    userAccount: userInfoUpdateRes.userAccount,
    userName: userInfoUpdateRes.userName,
    nickName: userInfoUpdateRes.nickName,
    avatar: userInfoUpdateRes.avatar,
    email: userInfoUpdateRes.email,
    phone: userInfoUpdateRes.phone,
    modifiedTime: userInfoUpdateRes.modifiedTime,
    registerTime: userInfoUpdateRes.registerTime
  }

  // 修改用户信息成功
  if (userInfoUpdateRes && editUserInfoResData.userId === userId) {
    const resData: EditUserInfoRes = editInfoView(EDIT_INFO_SUCCESS, editUserInfoResData)
    res.json(resData)
    return
  }

  const defaultResData: EditUserInfoRes = editInfoView()
  res.json(defaultResData)
}

/**
 * Edit user info API main controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function editInfo (): SessionRequestHandler {
  return (req: SessionRequest, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        editInfoV1(req, res, next)
        break
      }

      // API version not found
      default: {
        res.redirect('/404')
        break
      }
    }
  }
}
