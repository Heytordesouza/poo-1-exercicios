import { TVideosDB } from './../types';
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {

    public static TABLE_VIDEOS = "videos"

    public async findVideos(q: string | undefined): Promise<TVideosDB[]>{
        
        let videosDB

        if (q) {
            const result: TVideosDB[] = await BaseDatabase
                .connection(VideoDatabase.TABLE_VIDEOS)
                .where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result: TVideosDB[] = await BaseDatabase
                .connection(VideoDatabase.TABLE_VIDEOS)
            videosDB = result 
        }
        return videosDB
    }

    public async findVideoById(id: string | undefined): Promise <TVideosDB | undefined> {
        const [ videoDBExists ] = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .where({ id })
        return videoDBExists
    }

    public async insertVideo(newVideo: TVideosDB): Promise <void> {
        await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .insert(newVideo)
    }

    public async updateVideoById(videoId: string, newVideoDB: TVideosDB): Promise <void>{
        await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .update(newVideoDB)
            .where({id: videoId})
    }

    public async deleteVideo(videoId: string){
        await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .del()
        .where({id: videoId})
    }
}