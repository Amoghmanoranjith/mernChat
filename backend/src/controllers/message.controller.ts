import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.lib.js";
import { asyncErrorHandler } from "../utils/error.utils.js";
import { calculateSkip } from "../utils/generic.js";

export const getMessages = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const {page = 1, limit = 20} = req.query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    const messages = await prisma.message.findMany({
      where:{
        chatId:id
      },
      include:{
        sender:{
          select:{
            id:true,
            username:true,
            avatar:true,
          }
        },
        attachments:{
          select:{
            secureUrl:true,
          }
        },
        poll:{
          omit:{
            id:true,
          }
        },
        reactions:{
          select:{
            user:{
              select:{
                id:true,
                username:true,
                avatar:true
              }
            },
            reaction:true,
          }
        },
      },
      omit:{
        senderId:false,
      },
      orderBy:{
        createdAt:"asc"
      },
      skip:calculateSkip(pageNumber,limitNumber),
      take:limitNumber
    })

    const totalMessagesCount = await prisma.message.count({
      where:{
        chatId:id
      }
    });


    const totalPages = Math.ceil(totalMessagesCount / limitNumber);

    const messagesWithTotalPage = {
        messages:messages.reverse(),
        totalPages,
    }
    return res.status(200).json(messagesWithTotalPage)

})

