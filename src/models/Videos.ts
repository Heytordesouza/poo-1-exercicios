export class Video{
    constructor(
        private id:string,
        private title:string,
        private seconds:number,
        private date:string
    ){}


    public getId(){
        return this.id
    }

    public setId(newId:string): void{
        this.id = newId
    }

    public getTitle(){
        return this.title
    }

    public setTitle(newTitle:string): void{
        this.title = newTitle
    }

    public getSeconds(){
        return this.seconds
    }

    public setSeconds(newSeconds:number): void{
        this.seconds = newSeconds
    }

    public getDate(){
        return this.date
    }

    public setDate(newDate:string): void{
        this.date = newDate
    }
}