import { Request, Response } from "express"
import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/Videos"

export class VideoController {
    public getVideos = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined
    
            const videoDatabase = new VideoDatabase()
            const videosDB = await videoDatabase.findVideos(q)
    
            const videos: Video[] = videosDB.map((videoDB)=> new Video(
                videoDB.id,
                videoDB.title,
                videoDB.seconds,
                videoDB.date
            ))
    
            res.status(200).send(videos)  
    
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public createVideos = async (req: Request, res: Response) => {
        try {
            const { id, title, seconds} = req.body
    
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }
    
            if (typeof title !== "string") {
                res.status(400)
                throw new Error("'title' deve ser string")
            }
    
            if (typeof seconds !== "number") {
                res.status(400)
                throw new Error("'seconds' deve ser number")
            }
    
            const videoDatabase = new VideoDatabase()
            const videoDBExists = await videoDatabase.findVideoById(id)
    
            if (videoDBExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }
    
            const newVideo = new Video(
                id,
                title,
                seconds,
                new Date().toISOString()
            )
    
            const newVideoDB = {
                id: newVideo.getId(),
                title: newVideo.getTitle(),
                seconds: newVideo.getSeconds(),
                date: newVideo.getDate()
            }
    
            const newVideoDatabase = videoDatabase.insertVideo(newVideoDB)
    
            res.status(201).send(newVideo) 
            
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public editVideoById = async (req: Request, res: Response) => {
        try {
            const videoId = req.params.id 
    
            const videoDatabase = new VideoDatabase()
            const videoDBExists = await videoDatabase.findVideoById(videoId)
    
            if (!videoDBExists) {
                res.status(400)
                throw new Error("'id' não encontrada")
            }
    
            const { id, title, seconds } = req.body
    
            if(id !== undefined){
                if (typeof id !== "string") {
                    res.status(400)
                    throw new Error("'Id' deve ser string")
                }
            }    
    
            if(title !== undefined){
                if (typeof title !== "string") {
                    res.status(400)
                    throw new Error("'title' deve ser string")
                }
            }        
    
            if(seconds !== undefined){
                if (typeof seconds !== "number") {
                    res.status(400)
                    throw new Error("'seconds' deve ser number")
                }  
            }          
    
            const editedVideo = new Video(
                id || videoDBExists.id,
                title || videoDBExists.title,
                seconds || videoDBExists.seconds,
                new Date(Date.now()).toUTCString()
            )
    
            const newVideoDB = {
                id: editedVideo.getId(),
                title: editedVideo.getTitle(),
                seconds: editedVideo.getSeconds(),
                date: editedVideo.getDate()
            }
            
            editedVideo.setId(newVideoDB.id)
            editedVideo.setTitle(newVideoDB.title)
            editedVideo.setSeconds(newVideoDB.seconds)
            editedVideo.setDate(newVideoDB.date)
    
            await videoDatabase.updateVideoById(videoId, newVideoDB)
    
            res.status(200).send("Vídeo editado com sucesso")
    
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deleteVideoById = async (req: Request, res: Response) => {
        try {
            const videoId = req.params.id
    
            const videoDatabase = new VideoDatabase()
            const videoDBExists = await videoDatabase.findVideoById(videoId)
    
            if (!videoDBExists) {
                res.status(400)
                throw new Error("'id' não encontrada")
            }
    
            await videoDatabase.deleteVideo(videoId)

            res.status(200).send("Vídeo deletado com sucesso")
    
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}