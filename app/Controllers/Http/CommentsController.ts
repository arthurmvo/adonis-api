import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()

    const moment = await Moment.findOrFail(params.id)

    body.momentId = moment.id

    const comment = await Comment.create(body)

    response.status(201)

    return { message: 'Comentário criado com sucesso!', data: comment }
  }
}
