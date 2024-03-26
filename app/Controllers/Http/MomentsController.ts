import { v4 as uuidv4 } from 'uuid'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Moment from 'App/Models/Moment'

import Application from '@ioc:Adonis/Core/Application'

export default class MomentsController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)

    return { message: 'Momento criado com sucesso!', data: moment }
  }

  public async index({ response }: HttpContextContract) {
    const moments = await Moment.query().preload('comments')

    return moments
  }

  public async show({ params, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.load('comments')

    return {
      data: moment,
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.delete()

    return {
      message: 'Momento deletado com sucesso!',
      data: moment,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()

    const moment = await Moment.findOrFail(params.id)

    moment.merge(body)

    await moment.save()

    return {
      message: 'Momento atualizado com sucesso!',
      data: moment,
    }
  }
}
