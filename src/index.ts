import express, { Request, Response } from 'express'
import cors from 'cors'
// import { TVideosDB } from './types'
// import { db } from './database/knex'
import { Video } from './models/Videos'
import { VideoDatabase } from './database/VideoDatabase';

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
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
})

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined

        // let videosDB

        // if (q) {
        //     const result: TVideosDB[] = await db("videos").where("title", "LIKE", `%${q}%`)
        //     videosDB = result
        // } else {
        //     const result: TVideosDB[] = await db("videos")
        //     videosDB = result 
        // }

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
})

app.post("/videos", async (req: Request, res: Response) => {
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

        // if (typeof date !== "string") {
        //     res.status(400)
        //     throw new Error("'date' deve ser string")
        // }

        // const [ videoDBExists ]: TVideosDB[] | undefined[] = await db("videos").where({ id })

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

        // await db("videos").insert(newVideoDB)
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
})





// app.post("/videos", async (req: Request, res: Response) => {
//     try {
//         const idToEdit = req.params.id

//         if (idToEdit === ":id") {
//             res.status(400)
//             throw new Error("Informe um Id")
//         }

//         const [ foundVideo ]: TVideosDB[] | undefined[] = await db("videos").where({ id: idToEdit })

//         if (!foundVideo) {
//             res.status(400)
//             throw new Error("Video não encontrado")
//         }

//         const { newId, newTitle, newSeconds} = req.body

//         const [ videoDBExists ]: TVideosDB[] | undefined[] = await db("videos").where({ id: newId })

//         if (videoDBExists) {
//             res.status(400)
//             throw new Error("'id' já existe")
//         }

//         const [ videoToEdit ]: TVideosDB[] | undefined[] = await db("videos").where({ id: idToEdit })

//         const newVideo = new Video(
//             videoToEdit.id,
//             videoToEdit.title,
//             videoToEdit.seconds,
//             videoToEdit.date
//         )

//         if(newId !== undefined){
//             if (typeof newId !== "string"){
//                 res.status(400)
//                 throw new Error("'id' deve ser uma string")
//             }
//             newVideo.setId(newId)
//         }

//         if(newTitle !== undefined){
//             if (typeof newId !== "string"){
//                 res.status(400)
//                 throw new Error("'id' deve ser uma string")
//             }
//             newVideo.setTitle(newTitle)
//         }

//         if(newSeconds !== undefined){
//             if (typeof newSeconds !== "number"){
//                 res.status(400)
//                 throw new Error("'Seconds' deve ser um number")
//             }
//             newVideo.setSeconds(newSeconds)
//         }

//         const newVideoDB = {
//             ...newVideo, date: newVideo.setDate(new Date().toISOString())
//         }

//         await db("videos").update(newVideoDB).where({id: idToEdit})

//         res.status(201).send({
//             message: "Video editado com sucesso"
//         })

//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })







// app.put("/videos/:id", async (req: Request, res: Response) => {
//     try {
//         const videoId = req.params.id

//         const [ videoDBExists ] = await db("videos").where({ id: videoId })

//         if (!videoDBExists) {
//             res.status(400)
//             throw new Error("'id' não encontrada")
//         }

//         const { id, title, seconds } = req.body

//         if(id !== undefined){
//             if (typeof id !== "string") {
//                 res.status(400)
//                 throw new Error("'Id' deve ser string")
//             }
//         }    

//         if(title !== undefined){
//             if (typeof title !== "string") {
//                 res.status(400)
//                 throw new Error("'title' deve ser string")
//             }
//         }        

//         if(seconds !== undefined){
//             if (typeof seconds !== "number") {
//                 res.status(400)
//                 throw new Error("'seconds' deve ser number")
//             }  
//         }          

//         const editedVideo = new Video(
//             id || videoDBExists.id,
//             title || videoDBExists.title,
//             seconds || videoDBExists.seconds,
//             new Date(Date.now()).toUTCString()
//         )

//         const newVideoDB = {
//             id: editedVideo.getId(),
//             title: editedVideo.getTitle(),
//             seconds: editedVideo.getSeconds(),
//             date: editedVideo.getDate()
//         }

//         await db("videos").update(newVideoDB).where({id: videoId})
//         res.status(200).send("Vídeo editado com sucesso")

//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })

// app.delete("/videos/:id", async (req: Request, res: Response) => {
//     try {
//         const videoId = req.params.id

//         const [ videoDBExists ] = await db("videos").where({ id: videoId })

//         if (!videoDBExists) {
//             res.status(400)
//             throw new Error("'id' não encontrada")
//         }

//         await db("videos").del().where({id: videoId})
//         res.status(200).send("Vídeo deletado com sucesso")

//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })