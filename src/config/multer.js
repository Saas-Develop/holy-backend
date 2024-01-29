import multer from "multer";
import path from 'path'

export const storage = multer.diskStorage({
    //Aqui serve pra destinar o upload para algum diretório especifico
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        //Aqui serve pra eu dar nome ao arquivo.
        const time = new Date().getTime()
        cb(null, `${time}_${file.originalname}`)
    }
})