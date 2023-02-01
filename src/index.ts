import express, { Request, Response } from 'express'
import cors from 'cors'
// import { TVideosDB } from './types'
// import { db } from './database/knex'
// import { Video } from './models/Videos'
// import { VideoDatabase } from './database/VideoDatabase';
import { VideoController } from './controller/VideoController';

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})


const videoController = new VideoController()

app.get("/videos", videoController.getVideos)

app.post("/videos", videoController.createVideos)

app.put("/videos/:id", videoController.editVideoById)

app.delete("/videos/:id", videoController.deleteVideoById)